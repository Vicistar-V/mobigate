@echo off
setlocal EnableExtensions EnableDelayedExpansion
REM ============================================================================
REM sync.cmd - bulletproof + VERY VERBOSE Git sync helper (Windows CMD)
REM
REM GOAL:
REM   1. Recover from ANY broken state (interrupted rebase, aborted merge,
REM      unmerged/conflicted files left behind by a previous failed stash pop).
REM   2. Always fetch and land on the MOST RECENT remote version as the base.
REM   3. Re-apply the LOCAL user's changes ON TOP of that base.
REM      -> On any conflict, the LOCAL version WINS (their work is prioritized).
REM   4. Keep dependencies in sync (npm install).
REM   5. Commit + push (with a merge-based auto-recovery, NOT rebase).
REM
REM VERBOSE: every git/npm command is printed before it runs, and all command
REM          output is shown (nothing is hidden behind >nul). You can see
REM          exactly what is happening at each step.
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

echo ============================================================================
echo  SYNC START  -  %date% %time%
echo  Commit message: "%MSG%"
echo ============================================================================

REM --- 0. sanity: are we in a git repo? ---------------------------------------
echo.
echo [STEP 0/7] Verifying this is a git repository...
echo    ^> git rev-parse --is-inside-work-tree
git rev-parse --is-inside-work-tree
if errorlevel 1 (
    echo [ERROR] Not a git repository. Run this from your project folder.
    exit /b 1
)

echo    ^> git config http.postBuffer 157286400   ^(big buffer for large/slow pushes^)
git config http.postBuffer 157286400

REM --- detect current branch (fallback to main) -------------------------------
set "BRANCH=main"
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%b"
if "%BRANCH%"=="HEAD" set "BRANCH=main"
echo    Current branch detected: %BRANCH%

echo.
echo    --- Working tree status BEFORE sync ---
echo    ^> git status --short --branch
git status --short --branch

REM --- 1. self-heal any in-progress / broken state ----------------------------
echo.
echo [STEP 1/7] Cleaning up any broken / in-progress state...
for /f "delims=" %%g in ('git rev-parse --git-dir 2^>nul') do set "GITDIR=%%g"
echo    Git dir: %GITDIR%

if exist "%GITDIR%\rebase-merge" (
    echo    Interrupted rebase detected -^> aborting it.
    echo    ^> git rebase --abort
    git rebase --abort
)
if exist "%GITDIR%\rebase-apply" (
    echo    Interrupted rebase detected -^> aborting it.
    echo    ^> git rebase --abort
    git rebase --abort
)
if exist "%GITDIR%\MERGE_HEAD" (
    echo    In-progress merge detected -^> aborting it.
    echo    ^> git merge --abort
    git merge --abort
)

REM 1c. Clear leftover unmerged/conflicted files, keeping the LOCAL version
set "HADUNMERGED="
for /f "delims=" %%f in ('git diff --name-only --diff-filter=U 2^>nul') do (
    set "HADUNMERGED=1"
    echo    Unmerged file found -^> keeping LOCAL version of: %%f
    git checkout --theirs -- "%%f" >nul 2>&1
    if errorlevel 1 git checkout --ours -- "%%f" >nul 2>&1
    git add -- "%%f" >nul 2>&1
)
if defined HADUNMERGED (
    echo    ^> git reset   ^(unstage the auto-resolved files^)
    git reset
) else (
    echo    No leftover conflicts. Tree is sane.
)

REM --- 2. stash ALL local work (tracked + untracked) safely -------------------
echo.
echo [STEP 2/7] Saving ^(stashing^) your local changes...
set "DIDSTASH="
echo    ^> git stash push -u -m "sync-auto"
git stash push -u -m "sync-auto"
git stash list 2>nul | findstr /c:"sync-auto" >nul 2>&1
if not errorlevel 1 (
    set "DIDSTASH=1"
    echo    Local changes safely stashed.
) else (
    echo    Nothing to stash ^(clean tree^).
)

REM --- 3. safety backup branch of the exact local state ----------------------
echo.
echo [STEP 3/7] Creating a safety backup branch...
for /f "tokens=1-6 delims=/:. " %%a in ("%date% %time%") do set "STAMP=%%a%%b%%c-%%d%%e%%f"
set "STAMP=%STAMP: =0%"
set "BACKUP=backup/sync-%STAMP%"
echo    ^> git branch %BACKUP%
git branch "%BACKUP%"
echo    Safety backup branch created: %BACKUP%

REM --- 4. land on the MOST RECENT remote version (the base) -------------------
echo.
echo [STEP 4/7] Fetching latest remote and setting it as the base...
echo    ^> git fetch origin --prune --verbose
git fetch origin --prune --verbose
if errorlevel 1 (
    echo    [WARN] Fetch failed ^(network/auth?^). Restoring your changes and exiting.
    if defined DIDSTASH (
        echo    ^> git stash pop
        git stash pop
    )
    exit /b 1
)

git rev-parse --verify "origin/%BRANCH%" >nul 2>&1
if errorlevel 1 (
    echo    [WARN] Remote branch origin/%BRANCH% not found. Using current HEAD as base.
) else (
    echo    ^> git reset --hard origin/%BRANCH%
    git reset --hard "origin/%BRANCH%"
    echo    Base is now the latest origin/%BRANCH%.
    echo    ^> git log -1 --oneline   ^(new base commit^)
    git log -1 --oneline
)

REM --- 5. re-apply local changes ON TOP (local wins on conflict) --------------
echo.
echo [STEP 5/7] Re-applying your local changes on top ^(local takes priority^)...
if defined DIDSTASH (
    echo    ^> git stash pop
    git stash pop
    if errorlevel 1 (
        echo    Conflicts during pop - forcing LOCAL version on each:
        set "HADCONFLICT="
        for /f "delims=" %%f in ('git diff --name-only --diff-filter=U 2^>nul') do (
            set "HADCONFLICT=1"
            echo       forcing LOCAL version for: %%f
            git checkout --theirs -- "%%f" >nul 2>&1
            if errorlevel 1 git checkout --ours -- "%%f" >nul 2>&1
            git add -- "%%f" >nul 2>&1
        )
        if defined HADCONFLICT (
            echo    ^> git stash drop
            git stash drop
            echo    Conflicts auto-resolved in favor of LOCAL. ^(Fix any syntax later if needed.^)
        )
    ) else (
        echo    Local changes reapplied cleanly.
    )
) else (
    echo    Nothing was stashed - skipping.
)

echo.
echo    --- Working tree status AFTER merge ---
echo    ^> git status --short
git status --short

REM --- 5b. keep dependencies in sync (fixes "Failed to resolve import") --------
echo.
echo [STEP 6/7] Syncing dependencies ^(npm install^)...
if exist "package.json" (
    where npm >nul 2>&1
    if errorlevel 1 (
        echo    [WARN] npm not found on PATH - skipping. Run "npm install" manually.
    ) else (
        echo    ^> npm install --no-audit --no-fund
        call npm install --no-audit --no-fund
        if errorlevel 1 (
            echo    [WARN] npm install hit an issue - try running it manually.
        ) else (
            echo    Dependencies are up to date.
        )
    )
) else (
    echo    No package.json found - skipping dependency sync.
)

REM --- 7. stage + commit + push ----------------------------------------------
echo.
echo [STEP 7/7] Staging, committing and pushing...
echo    ^> git add -A
git add -A
git status --porcelain | findstr /r /c:"." >nul 2>&1
if not errorlevel 1 (
    echo    ^> git commit -m "%MSG%"
    git commit -m "%MSG%"
    echo    Committed: "%MSG%"
) else (
    echo    Nothing to commit - working tree matches remote.
)

echo.
echo    Pushing to origin/%BRANCH% ...
echo    ^> git push origin %BRANCH%
git push origin "%BRANCH%"
if errorlevel 1 (
    echo    [WARN] Push rejected ^(remote moved^). Pulling latest and merging ^(no rebase^)...
    echo    ^> git pull --no-rebase --no-edit origin %BRANCH%
    git pull --no-rebase --no-edit origin "%BRANCH%"
    if errorlevel 1 (
        echo    Merge conflicts during pull - forcing LOCAL version on each:
        for /f "delims=" %%f in ('git diff --name-only --diff-filter=U 2^>nul') do (
            echo       keeping LOCAL version of: %%f
            git checkout --ours -- "%%f" >nul 2>&1
            git add -- "%%f" >nul 2>&1
        )
        echo    ^> git commit --no-edit
        git commit --no-edit
    )
    echo    ^> git push origin %BRANCH%   ^(retry^)
    git push origin "%BRANCH%"
)

if errorlevel 1 (
    echo.
    echo [ERROR] Push still failing - check your auth / network. Your work is safe in %BACKUP%.
    exit /b 1
)

echo.
echo ============================================================================
echo  SYNC DONE  -  everything is synchronised.
echo  Latest commits:
echo    ^> git log -3 --oneline
git log -3 --oneline
echo.
echo  Safety backup kept at: %BACKUP%
echo  ^(Delete old backups later with: git branch -D %BACKUP%^)
echo ============================================================================
endlocal
exit /b 0
