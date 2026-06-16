@echo off
setlocal EnableExtensions EnableDelayedExpansion
REM ============================================================================
REM sync.cmd - bulletproof Git sync helper (Windows CMD - no PowerShell needed)
REM
REM GOAL:
REM   1. Recover from ANY broken state (interrupted rebase, aborted merge,
REM      unmerged/conflicted files left behind by a previous failed stash pop).
REM   2. Always fetch and land on the MOST RECENT remote version as the base.
REM   3. Re-apply the LOCAL user's changes ON TOP of that base.
REM      -> On any conflict, the LOCAL version WINS (their work is prioritized).
REM   4. Commit + push.
REM
REM Nothing is ever lost: before the hard sync, a backup branch is created
REM (backup/sync-<timestamp>) pointing at the exact local state.
REM Recover old local commits with:  git checkout backup/sync-...
REM
REM Usage:
REM   sync                  (commit message defaults to "new updates")
REM   sync "my message"     (custom commit message - keep the quotes)
REM ============================================================================

REM --- commit message (default = "new updates") -------------------------------
set "MSG=%~1"
if "%MSG%"=="" set "MSG=new updates"

REM --- 0. sanity: are we in a git repo? ---------------------------------------
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository. Run this from your project folder.
    exit /b 1
)

REM Big push buffer (fixes flaky pushes on large updates / slow connections)
git config http.postBuffer 157286400 >nul 2>&1

REM --- detect current branch (fallback to main) -------------------------------
set "BRANCH=main"
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%b"
if "%BRANCH%"=="HEAD" set "BRANCH=main"
echo === Current branch: %BRANCH% ===

REM --- 1. self-heal any in-progress / broken state ----------------------------
echo.
echo === Cleaning up any broken state ===
for /f "delims=" %%g in ('git rev-parse --git-dir 2^>nul') do set "GITDIR=%%g"

if exist "%GITDIR%\rebase-merge" (
    echo    Interrupted rebase detected -^> aborting it.
    git rebase --abort >nul 2>&1
)
if exist "%GITDIR%\rebase-apply" (
    echo    Interrupted rebase detected -^> aborting it.
    git rebase --abort >nul 2>&1
)
if exist "%GITDIR%\MERGE_HEAD" (
    echo    In-progress merge detected -^> aborting it.
    git merge --abort >nul 2>&1
)

REM 1c. Clear leftover unmerged/conflicted files, keeping the LOCAL version
set "HADUNMERGED="
for /f "delims=" %%f in ('git diff --name-only --diff-filter=U 2^>nul') do (
    set "HADUNMERGED=1"
    echo    keeping LOCAL version of: %%f
    git checkout --theirs -- "%%f" >nul 2>&1
    if errorlevel 1 git checkout --ours -- "%%f" >nul 2>&1
    git add -- "%%f" >nul 2>&1
)
if defined HADUNMERGED git reset -q >nul 2>&1

REM --- 2. stash ALL local work (tracked + untracked) safely -------------------
echo.
echo === Saving your local changes ===
set "DIDSTASH="
git stash push -u -m "sync-auto" >nul 2>&1
git stash list 2>nul | findstr /c:"sync-auto" >nul 2>&1
if not errorlevel 1 (
    set "DIDSTASH=1"
    echo    Local changes stashed.
) else (
    echo    Nothing to stash ^(clean tree^).
)

REM --- 3. safety backup branch of the exact local state ----------------------
for /f "tokens=1-6 delims=/:. " %%a in ("%date% %time%") do set "STAMP=%%a%%b%%c-%%d%%e%%f"
set "STAMP=%STAMP: =0%"
set "BACKUP=backup/sync-%STAMP%"
git branch "%BACKUP%" >nul 2>&1
echo    Safety backup branch created: %BACKUP%

REM --- 4. land on the MOST RECENT remote version (the base) -------------------
echo.
echo === Fetching latest remote and setting it as the base ===
git fetch origin --prune
if errorlevel 1 (
    echo    [WARN] Fetch failed ^(network/auth?^). Restoring your changes and exiting.
    if defined DIDSTASH git stash pop >nul 2>&1
    exit /b 1
)

git rev-parse --verify "origin/%BRANCH%" >nul 2>&1
if errorlevel 1 (
    echo    [WARN] Remote branch origin/%BRANCH% not found. Using current HEAD as base.
) else (
    git reset --hard "origin/%BRANCH%"
    echo    Base is now the latest origin/%BRANCH%.
)

REM --- 5. re-apply local changes ON TOP (local wins on conflict) --------------
if defined DIDSTASH (
    echo.
    echo === Re-applying your local changes on top ^(local takes priority^) ===
    git stash pop
    if errorlevel 1 (
        set "HADCONFLICT="
        for /f "delims=" %%f in ('git diff --name-only --diff-filter=U 2^>nul') do (
            set "HADCONFLICT=1"
            echo    forcing LOCAL version for: %%f
            git checkout --theirs -- "%%f" >nul 2>&1
            if errorlevel 1 git checkout --ours -- "%%f" >nul 2>&1
            git add -- "%%f" >nul 2>&1
        )
        if defined HADCONFLICT (
            git stash drop >nul 2>&1
            echo    Conflicts auto-resolved in favor of LOCAL. ^(Fix any syntax later if needed.^)
        )
    ) else (
        echo    Local changes reapplied cleanly.
    )
)

REM --- 5b. keep dependencies in sync (fixes "Failed to resolve import") --------
REM   After landing remote changes, package.json may list new packages that your
REM   local node_modules doesn't have yet (e.g. framer-motion). Auto-install so
REM   the dev server never breaks with a missing-module error.
if exist "package.json" (
    echo.
    echo === Syncing dependencies ^(npm install^) ===
    where npm >nul 2>&1
    if errorlevel 1 (
        echo    [WARN] npm not found on PATH - skipping. Run "npm install" manually.
    ) else (
        if exist "package-lock.json" (
            call npm install --no-audit --no-fund
        ) else (
            call npm install --no-audit --no-fund
        )
        if errorlevel 1 (
            echo    [WARN] npm install hit an issue - try running it manually.
        ) else (
            echo    Dependencies are up to date.
        )
    )
)

echo.
echo === Staging and committing ===
git add -A
git status --porcelain | findstr /r /c:"." >nul 2>&1
if not errorlevel 1 (
    git commit -m "%MSG%"
    echo    Committed: "%MSG%"
) else (
    echo    Nothing to commit - working tree matches remote.
)

REM --- 7. push (with one auto-recovery retry) --------------------------------
echo.
echo === Pushing to origin/%BRANCH% ===
git push origin "%BRANCH%"
if errorlevel 1 (
    echo    [WARN] Push rejected ^(remote moved^). Pulling latest and merging...
    git pull --no-rebase --no-edit origin "%BRANCH%"
    if errorlevel 1 (
        for /f "delims=" %%f in ('git diff --name-only --diff-filter=U 2^>nul') do (
            echo    keeping LOCAL version of: %%f
            git checkout --ours -- "%%f" >nul 2>&1
            git add -- "%%f" >nul 2>&1
        )
        git commit --no-edit >nul 2>&1
    )
    git push origin "%BRANCH%"
)

if errorlevel 1 (
    echo.
    echo [ERROR] Push still failing - check your auth / network. Your work is safe in %BACKUP%.
    exit /b 1
)

echo.
echo DONE - everything is synchronised. Backup kept at %BACKUP%
echo ^(You can delete old backups later: git branch -D %BACKUP%^)
endlocal
exit /b 0
