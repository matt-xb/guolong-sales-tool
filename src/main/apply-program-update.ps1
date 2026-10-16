param([Parameter(Mandatory=$true)][string]$JobPath)
$ErrorActionPreference = 'Stop'
$job = Get-Content -LiteralPath $JobPath -Raw -Encoding UTF8 | ConvertFrom-Json
$target = [IO.Path]::GetFullPath($job.target).TrimEnd('\')
$jobDir = [IO.Path]::GetFullPath((Split-Path -Parent $JobPath))
$localRoot = Join-Path $target 'local-data'
if (-not $jobDir.StartsWith($localRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid job directory' }
$stage = [IO.Path]::GetFullPath($job.stage)
if ($stage -ne (Join-Path $jobDir 'stage')) { throw 'Invalid stage directory' }
$backup = Join-Path $jobDir 'backup'
$resultPath = Join-Path $localRoot 'program-update-result.json'
$saved = [Collections.Generic.List[string]]::new()
$installed = [Collections.Generic.List[string]]::new()
$recoveryRequired = $false
function File-Hash([string]$file) {
    $stream = [IO.File]::OpenRead($file)
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
    finally { $stream.Dispose(); $sha.Dispose() }
}
function Safe-Path([string]$base, [string]$relative) {
    if (-not $relative -or $relative -match '[\\:<>"|?*\x00-\x1f]' -or $relative -match '^(outputs|local-data|backups|db-backups)(/|$)' -or $relative -match '(^|/)(\.|\.\.|\.git|\.codex|\.agents)(/|$)' -or $relative -match '(^|/)(\.env($|\.)|recent-files\.json$|update-source\.txt$|debug\.log$|sync-manifest\.json)' ) { throw 'Invalid update path' }
    $resolved = [IO.Path]::GetFullPath((Join-Path $base $relative))
    if (-not $resolved.StartsWith($base + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Update path escapes root' }
    $cursor = $resolved
    while ($cursor.Length -ge $base.Length) {
        if ((Test-Path -LiteralPath $cursor) -and ((Get-Item -LiteralPath $cursor -Force).Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Update path contains link' }
        if ($cursor -eq $base) { break }
        $cursor = Split-Path -Parent $cursor
    }
    return $resolved
}
Set-Content -LiteralPath (Join-Path $jobDir 'ready') -Value 'ready' -Encoding ASCII
try {
    if ($job.pid -gt 0) {
        $oldProcess = Get-Process -Id $job.pid -ErrorAction SilentlyContinue
        if ($oldProcess) { $oldProcess | Wait-Process -Timeout 60 }
    }
    if (-not (Test-Path -LiteralPath (Join-Path $jobDir 'approved'))) { $job.restart=$false; return }
    # Check every staged replacement before changing the installed program.
    foreach ($file in $job.files) {
        $candidate = Safe-Path $stage $file.path
        if ((Get-Item -LiteralPath $candidate).Length -ne $file.size -or (File-Hash $candidate) -ne $file.sha256) { throw 'Staged file validation failed' }
        $null = Safe-Path $target $file.path
    }
    foreach ($relative in @($job.deletes) + @($job.directories) + @($job.emptyDirectories)) { $null = Safe-Path $target $relative }
    @{ok=$false;recoveryRequired=$true;backup=$jobDir;message='Installation interrupted before completion'} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding UTF8
    foreach ($relative in @($job.deletes) + @($job.files | ForEach-Object { $_.path })) {
        $destination = Safe-Path $target $relative
        if (Test-Path -LiteralPath $destination -PathType Leaf) {
            $old = Safe-Path $backup $relative
            $null = New-Item -ItemType Directory -Path (Split-Path -Parent $old) -Force
            Move-Item -LiteralPath $destination -Destination $old
            $saved.Add($relative)
        }
    }
    foreach ($relative in @($job.emptyDirectories | Sort-Object Length -Descending)) {
        $directory = Safe-Path $target $relative
        if ((Test-Path -LiteralPath $directory -PathType Container) -and @(Get-ChildItem -LiteralPath $directory -Force).Count -eq 0) { Remove-Item -LiteralPath $directory }
    }
    foreach ($relative in $job.directories) { $null = New-Item -ItemType Directory -Path (Safe-Path $target $relative) -Force }
    foreach ($file in $job.files) {
        $destination = Safe-Path $target $file.path
        if (Test-Path -LiteralPath $destination -PathType Container) {
            if (@(Get-ChildItem -LiteralPath $destination -Force).Count) { throw 'Non-empty directory conflicts with update file' }
            Remove-Item -LiteralPath $destination
        }
        $null = New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force
        Move-Item -LiteralPath (Safe-Path $stage $file.path) -Destination $destination
        $installed.Add($file.path)
    }
    @{ok=$true;version=$job.version} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding UTF8
} catch {
    $failure = $_.Exception.Message
    for ($i=$installed.Count-1; $i -ge 0; $i--) {
        try { Remove-Item -LiteralPath (Safe-Path $target $installed[$i]) -Force } catch { $recoveryRequired=$true }
    }
    foreach ($relative in @($job.directories | Sort-Object Length -Descending)) {
        try {
            $directory = Safe-Path $target $relative
            if ((Test-Path -LiteralPath $directory -PathType Container) -and @(Get-ChildItem -LiteralPath $directory -Force).Count -eq 0) { Remove-Item -LiteralPath $directory }
        } catch { $recoveryRequired=$true }
    }
    for ($i=$saved.Count-1; $i -ge 0; $i--) {
        try {
            $destination = Safe-Path $target $saved[$i]
            if (Test-Path -LiteralPath $destination -PathType Container) { if (@(Get-ChildItem -LiteralPath $destination -Force).Count) { throw 'Restore conflict' }; Remove-Item -LiteralPath $destination }
            $null = New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force
            Move-Item -LiteralPath (Safe-Path $backup $saved[$i]) -Destination $destination
        } catch { $recoveryRequired=$true }
    }
    @{ok=$false;recoveryRequired=$recoveryRequired;backup=$jobDir;message=$failure} | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding UTF8
} finally {
    if (-not (Test-Path -LiteralPath (Join-Path $jobDir 'approved'))) { $job.restart=$false }
    if (-not $recoveryRequired -and $job.restart) {
        $exe = [IO.Path]::GetFullPath($job.exePath)
        if ((Split-Path -Parent $exe) -eq $target -and (Test-Path -LiteralPath $exe -PathType Leaf)) { Start-Process -FilePath $exe -WorkingDirectory $target }
    }
    if (-not $recoveryRequired) { Remove-Item -LiteralPath $jobDir -Recurse -Force }
}
