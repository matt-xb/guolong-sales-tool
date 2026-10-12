param(
  [Parameter(Mandatory = $true)][string]$SourcePath,
  [Parameter(Mandatory = $true)][string]$TargetDir,
  [Parameter(Mandatory = $true)][string]$ExePath
)

$ErrorActionPreference = 'Stop'
$RunLogPath = Join-Path $TargetDir 'update-run.log'

function Write-UpdateLog {
  param([string]$Message)
  try {
    Add-Content -LiteralPath $RunLogPath -Value ("{0} {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message) -Encoding UTF8
  } catch {}
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$form = New-Object System.Windows.Forms.Form
$form.Text = 'Guolong Sales Tool Update'
$form.Width = 520
$form.Height = 170
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.MinimizeBox = $false
$form.TopMost = $true

$label = New-Object System.Windows.Forms.Label
$label.Left = 22
$label.Top = 22
$label.Width = 460
$label.Height = 36
$label.Text = 'Preparing update...'
$form.Controls.Add($label)

$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Left = 22
$progress.Top = 70
$progress.Width = 460
$progress.Height = 24
$progress.Minimum = 0
$progress.Maximum = 100
$form.Controls.Add($progress)

$detail = New-Object System.Windows.Forms.Label
$detail.Left = 22
$detail.Top = 105
$detail.Width = 460
$detail.Height = 24
$detail.ForeColor = [System.Drawing.Color]::FromArgb(90, 105, 112)
$detail.Text = 'Please do not close this window.'
$form.Controls.Add($detail)

function Set-UpdateProgress {
  param([int]$Percent, [string]$Message, [string]$DetailText = '')
  $progress.Value = [Math]::Max(0, [Math]::Min(100, $Percent))
  $label.Text = $Message
  if ($DetailText) { $detail.Text = $DetailText }
  [System.Windows.Forms.Application]::DoEvents()
}

function Normalize-PathText {
  param([string]$PathValue)
  $value = [string]$PathValue
  $value = $value.Replace('Microsoft.PowerShell.Core\FileSystem::', '')
  $value = $value.Replace('/', '\').Trim()
  if ($value.StartsWith('\\?\UNC\', [System.StringComparison]::OrdinalIgnoreCase)) {
    $value = '\\' + $value.Substring(8)
  } elseif ($value.StartsWith('\\?\', [System.StringComparison]::OrdinalIgnoreCase)) {
    $value = $value.Substring(4)
  }
  return $value.TrimEnd('\')
}

function Get-RelativePath {
  param([string]$Root, [string]$FullName)
  $rootPath = Normalize-PathText $Root
  $fullPath = Normalize-PathText $FullName
  if ($fullPath.Length -gt $rootPath.Length -and $fullPath.StartsWith($rootPath + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
    return $fullPath.Substring($rootPath.Length + 1)
  }
  return Split-Path -Leaf $fullPath
}

function Is-OutputsPath {
  param([string]$RelativePath)
  return $RelativePath -ieq 'outputs' -or $RelativePath.StartsWith('outputs\')
}

function Copy-WithRetry {
  param([string]$Source, [string]$Target)
  $parent = Split-Path -Parent $Target
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
  for ($attempt = 1; $attempt -le 20; $attempt += 1) {
    try {
      Copy-Item -LiteralPath $Source -Destination $Target -Force
      return
    } catch {
      if ($attempt -eq 20) { throw }
      Start-Sleep -Milliseconds 300
    }
  }
}

$form.Show()
[System.Windows.Forms.Application]::DoEvents()

try {
  Write-UpdateLog "start source=$SourcePath target=$TargetDir exe=$ExePath"
  Set-UpdateProgress 1 'Waiting for the sales tool to close...' 'Preparing to copy files.'
  Start-Sleep -Seconds 2

  if (-not (Test-Path -LiteralPath $SourcePath)) {
    throw "Cannot access update source: $SourcePath"
  }
  if (-not (Test-Path -LiteralPath $TargetDir)) {
    throw "Cannot access local target: $TargetDir"
  }

  $sourceRoot = (Resolve-Path -LiteralPath $SourcePath).Path.TrimEnd('\')
  $targetRoot = (Resolve-Path -LiteralPath $TargetDir).Path.TrimEnd('\')
  if ($sourceRoot -ieq $targetRoot) {
    throw 'The update source and local target are the same.'
  }

  Set-UpdateProgress 5 'Scanning update files...' $sourceRoot
  $sourceFiles = Get-ChildItem -LiteralPath $sourceRoot -Recurse -Force -File |
    Where-Object { -not (Is-OutputsPath (Get-RelativePath $sourceRoot $_.FullName)) }
  $targetFiles = Get-ChildItem -LiteralPath $targetRoot -Recurse -Force -File |
    Where-Object { -not (Is-OutputsPath (Get-RelativePath $targetRoot $_.FullName)) }
  $total = [Math]::Max(1, $sourceFiles.Count + $targetFiles.Count)
  $done = 0

  $sourceSet = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
  foreach ($file in $sourceFiles) {
    [void]$sourceSet.Add((Get-RelativePath $sourceRoot $file.FullName))
  }

  foreach ($file in $sourceFiles) {
    $relative = Get-RelativePath $sourceRoot $file.FullName
    $target = Join-Path $targetRoot $relative
    Copy-WithRetry $file.FullName $target
    $done += 1
    Set-UpdateProgress ([int](5 + ($done / $total * 85))) 'Copying new files...' $relative
  }

  foreach ($file in $targetFiles) {
    $relative = Get-RelativePath $targetRoot $file.FullName
    if (-not $sourceSet.Contains($relative)) {
      Remove-Item -LiteralPath $file.FullName -Force -ErrorAction SilentlyContinue
    }
    $done += 1
    Set-UpdateProgress ([int](5 + ($done / $total * 85))) 'Cleaning old files...' $relative
  }

  $targetDirs = Get-ChildItem -LiteralPath $targetRoot -Recurse -Force -Directory |
    Sort-Object FullName -Descending |
    Where-Object { -not (Is-OutputsPath (Get-RelativePath $targetRoot $_.FullName)) }
  foreach ($dir in $targetDirs) {
    try {
      if (-not (Get-ChildItem -LiteralPath $dir.FullName -Force -ErrorAction SilentlyContinue)) {
        Remove-Item -LiteralPath $dir.FullName -Force -ErrorAction SilentlyContinue
      }
    } catch {}
  }

  Set-UpdateProgress 96 'Update complete. Restarting...' 'The local outputs folder was kept.'
  Start-Sleep -Seconds 1
  if (Test-Path -LiteralPath $ExePath) {
    Start-Process -FilePath $ExePath
  }
  Write-UpdateLog 'success'
  Set-UpdateProgress 100 'Update complete.' 'You can close this window.'
  Start-Sleep -Seconds 1
  $form.Close()
} catch {
  Write-UpdateLog ("failed " + $_.Exception.Message)
  Set-UpdateProgress 100 'Update failed.' ($_.Exception.Message)
  [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Guolong Sales Tool Update Failed', 'OK', 'Error') | Out-Null
}
