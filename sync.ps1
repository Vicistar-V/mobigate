# sync.ps1 — one-shot Git sync helper (Windows PowerShell)
# Usage:  ./sync.ps1            (uses default commit message "new updates")
#         ./sync.ps1 "my msg"   (custom commit message)
#
# Steps:
#   1. Stash any local changes
#   2. Pull latest with rebase
#   3. Restore stashed changes
#   4. Stage everything
#   5. Commit
#   6. Push

param(
    [string]$Message = "new updates"
)

$ErrorActionPreference = "Stop"

function Run($cmd) {
    Write-Host "→ $cmd" -ForegroundColor Cyan
    Invoke-Expression $cmd
}

try {
    # 1. Stash local changes (only if there is something to stash)
    $hasChanges = (git status --porcelain)
    $stashed = $false
    if ($hasChanges) {
        Run "git stash"
        $stashed = $true
    } else {
        Write-Host "Nothing to stash — working tree clean." -ForegroundColor DarkGray
    }

    # 2. Pull latest changes with rebase
    Run "git pull --rebase"

    # 3. Restore stashed changes (only if we actually stashed)
    if ($stashed) {
        Run "git stash pop"
    }

    # 4. Stage everything
    Run "git add ."

    # 5. Commit (skip gracefully if nothing to commit)
    $staged = (git status --porcelain)
    if ($staged) {
        Run "git commit -m `"$Message`""
        # 6. Push
        Run "git push"
        Write-Host "`n✔ Sync complete." -ForegroundColor Green
    } else {
        Write-Host "`n✔ Already up to date — nothing to commit or push." -ForegroundColor Green
    }
}
catch {
    Write-Host "`n�‼ Sync failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Resolve the issue above (e.g. merge/rebase conflicts) and run ./sync.ps1 again." -ForegroundColor Yellow
    exit 1
}
