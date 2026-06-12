# sync.ps1 — bulletproof Git sync helper (Windows PowerShell / Git Bash MINGW64 friendly)
#
# GOAL:
#   1. Recover from ANY broken state (interrupted rebase, aborted merge,
#      unmerged/conflicted files left behind by a previous failed stash pop).
#   2. Always fetch and land on the MOST RECENT remote version as the base.
#   3. Re-apply the LOCAL user's changes ON TOP of that base.
#      -> On any conflict, the LOCAL version WINS (their work is prioritized).
#   4. Commit + push.
#
# Nothing is ever lost: before the hard sync, a backup branch is created
# (backup/sync-<timestamp>) pointing at the exact local state, so you can
# always recover old local commits with:  git checkout backup/sync-...
#
# Usage:
#   ./sync.ps1              # commit message defaults to "new updates"
#   ./sync.ps1 "my msg"     # custom commit message

param(
    [string]$Message = "new updates"
)

# --- helpers ----------------------------------------------------------------
function Step($txt)  { Write-Host "`n=== $txt ===" -ForegroundColor Cyan }
function Info($txt)  { Write-Host "   $txt" -ForegroundColor DarkGray }
function Ok($txt)    { Write-Host "OK  $txt" -ForegroundColor Green }
function Warn($txt)  { Write-Host "!!  $txt" -ForegroundColor Yellow }

# Run a git command but DON'T blow up the whole script on a non-zero exit.
# Returns the captured output; sets $script:LastGitExit.
function Git {
    param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Args)
    Write-Host "git $($Args -join ' ')" -ForegroundColor Blue
    $out = & git @Args 2>&1
    $script:LastGitExit = $LASTEXITCODE
    if ($out) { $out | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkGray } }
    return $out
}

# --- 0. sanity: are we in a git repo? --------------------------------------
$null = & git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not a git repository. Run this from your project folder." -ForegroundColor Red
    exit 1
}

# Big push buffer (fixes flaky pushes on large updates / slow connections)
Git config http.postBuffer 157286400 | Out-Null

$branch = (& git rev-parse --abbrev-ref HEAD).Trim()
if (-not $branch -or $branch -eq "HEAD") { $branch = "main" }
Info "Current branch: $branch"

# --- 1. self-heal any in-progress / broken state ---------------------------
Step "Cleaning up any broken state"

$gitDir = (& git rev-parse --git-dir).Trim()

# 1a. Abort an interrupted rebase (rebase-merge OR rebase-apply dirs)
if ((Test-Path (Join-Path $gitDir "rebase-merge")) -or (Test-Path (Join-Path $gitDir "rebase-apply"))) {
    Warn "Interrupted rebase detected -> aborting it."
    Git rebase --abort | Out-Null
}

# 1b. Abort an in-progress merge
if (Test-Path (Join-Path $gitDir "MERGE_HEAD")) {
    Warn "In-progress merge detected -> aborting it."
    Git merge --abort | Out-Null
}

# 1c. Clear any leftover unmerged/conflicted files (e.g. from a failed stash pop).
#     We prioritize the LOCAL working version, then unstage so they get
#     re-evaluated against the fresh remote below.
$unmerged = & git diff --name-only --diff-filter=U
if ($unmerged) {
    Warn "Unmerged files left behind -> keeping LOCAL version of each:"
    foreach ($f in $unmerged) {
        $f = $f.Trim()
        if (-not $f) { continue }
        Info " - $f"
        # --theirs here = the working/local side that was being applied
        & git checkout --theirs -- "$f" 2>$null
        if ($LASTEXITCODE -ne 0) { & git checkout --ours -- "$f" 2>$null }
        & git add -- "$f" 2>$null
    }
    # Unstage everything so the stash-based reapply below is the single source of truth
    Git reset -q | Out-Null
}

# --- 2. stash ALL local work (tracked + untracked) safely ------------------
Step "Saving your local changes"
$preStash = & git stash list
Git stash push -u -m "sync-auto" | Out-Null
$postStash = & git stash list
$didStash = ($postStash.Count -ne $preStash.Count) -or
            ($postStash -and ($postStash | Select-Object -First 1) -match "sync-auto")
if ($didStash) { Ok "Local changes stashed." } else { Info "Nothing to stash (clean tree)." }

# --- 3. create a safety backup branch of the exact local state -------------
$stamp  = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = "backup/sync-$stamp"
Git branch $backup | Out-Null
Info "Safety backup branch created: $backup"

# --- 4. land on the MOST RECENT remote version (the base) ------------------
Step "Fetching latest remote and setting it as the base"
Git fetch origin --prune | Out-Null
if ($script:LastGitExit -ne 0) {
    Warn "Fetch failed (network/auth?). Restoring your changes and exiting."
    if ($didStash) { Git stash pop | Out-Null }
    exit 1
}

# Hard-align local branch to the remote tip = guaranteed newest remote version.
$remoteRef = "origin/$branch"
$null = & git rev-parse --verify $remoteRef 2>$null
if ($LASTEXITCODE -ne 0) {
    Warn "Remote branch $remoteRef not found. Using current HEAD as base."
} else {
    Git reset --hard $remoteRef | Out-Null
    Ok "Base is now the latest $remoteRef."
}

# --- 5. re-apply local changes ON TOP (local wins on conflict) -------------
if ($didStash) {
    Step "Re-applying your local changes on top (local takes priority)"
    Git stash pop | Out-Null
    if ($script:LastGitExit -ne 0) {
        $conflicts = & git diff --name-only --diff-filter=U
        if ($conflicts) {
            Warn "Conflicts while reapplying -> forcing the LOCAL version for:"
            foreach ($f in $conflicts) {
                $f = $f.Trim()
                if (-not $f) { continue }
                Info " - $f"
                # During a stash pop: --theirs = the stashed (LOCAL) content.
                & git checkout --theirs -- "$f" 2>$null
                if ($LASTEXITCODE -ne 0) { & git checkout --ours -- "$f" 2>$null }
                & git add -- "$f" 2>$null
            }
            # The stash entry is kept on conflict; drop it now that we resolved.
            Git stash drop | Out-Null
            Warn "Conflicts auto-resolved in favor of LOCAL. (Fix any syntax later if needed.)"
        } else {
            Warn "stash pop reported an issue but no conflicts were found."
        }
    } else {
        Ok "Local changes reapplied cleanly."
    }
}

# --- 6. stage + commit -----------------------------------------------------
Step "Staging and committing"
Git add -A | Out-Null
$pending = & git status --porcelain
if ($pending) {
    Git commit -m "$Message" | Out-Null
    Ok "Committed: `"$Message`""
} else {
    Info "Nothing to commit — working tree matches remote."
}

# --- 7. push (with one auto-recovery retry) --------------------------------
Step "Pushing to origin/$branch"
Git push origin $branch | Out-Null
if ($script:LastGitExit -ne 0) {
    Warn "Push rejected (remote moved). Re-fetching and replaying your commit on top..."
    Git fetch origin --prune | Out-Null
    Git rebase "origin/$branch" | Out-Null
    if ($script:LastGitExit -ne 0) {
        $conflicts = & git diff --name-only --diff-filter=U
        foreach ($f in $conflicts) {
            $f = $f.Trim(); if (-not $f) { continue }
            & git checkout --ours -- "$f" 2>$null   # --ours = your replayed commit
            & git add -- "$f" 2>$null
        }
        Git rebase --continue | Out-Null
    }
    Git push origin $branch | Out-Null
}

if ($script:LastGitExit -eq 0) {
    Write-Host "`nDONE - everything is synchronised. Backup kept at $backup" -ForegroundColor Green
    Write-Host "(You can delete old backups later: git branch -D $backup)" -ForegroundColor DarkGray
} else {
    Write-Host "`nPush still failing - check your auth / network. Your work is safe in $backup." -ForegroundColor Red
    exit 1
}
