# backup.ps1 — универсальный бэкап-пакер для UrbanVision
# Использование:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\backup.ps1 -Target single  -OutDir C:\projects
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\backup.ps1 -Target vscode  -OutDir C:\projects
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\backup.ps1 -Target github  -OutDir C:\projects
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\backup.ps1 -Target all     -OutDir C:\projects

[CmdletBinding()]
param(
  [ValidateSet('single','vscode','github','all')]
  [string]$Target = 'all',

  [string]$OutDir = 'C:\projects'
)

# Настройка кодировки и режимов
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$global:Backups = @()

# --- Контексты и утилиты ------------------------------------------------------

$ProjectRoot = $PSScriptRoot
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'package.json'))) {
  throw "Package.json not found. Make sure backup.ps1 is in project root."
}

function New-BackupTag {
  $stamp = Get-Date -Format 'yyyyMMdd'
  $rand  = Get-Random -Minimum 1000000 -Maximum 9999999
  return "$stamp-$rand"
}

function Get-PackageRunner {
  $pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
  if ($pnpm) { return 'pnpm' }
  $npm = Get-Command npm -ErrorAction SilentlyContinue
  if ($npm) { return 'npm' }
  throw "Neither pnpm nor npm found. Please install one and try again."
}

function New-TempDirectory {
  param([string]$Prefix)
  $tag = New-BackupTag
  $path = Join-Path ([IO.Path]::GetTempPath()) "$Prefix-$tag"
  if (Test-Path -LiteralPath $path) {
    Remove-Item -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue
  }
  New-Item -ItemType Directory -Path $path | Out-Null
  return $path
}

function Invoke-RoboCopyMirror {
  param(
    [Parameter(Mandatory)] [string]$Source,
    [Parameter(Mandatory)] [string]$Destination,
    [string[]]$ExcludeDirs = @(),
    [string[]]$ExcludeFiles = @('*.log')
  )
  $roboArgs = @(
    $Source, $Destination, '/MIR', '/R:2', '/W:2', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'
  )
  if ($ExcludeDirs -and $ExcludeDirs.Count)   { $roboArgs += '/XD'; $roboArgs += $ExcludeDirs }
  if ($ExcludeFiles -and $ExcludeFiles.Count) { $roboArgs += '/XF'; $roboArgs += $ExcludeFiles }

  & robocopy @roboArgs | Out-Null
  if ($LASTEXITCODE -ge 8) {
    throw "Robocopy failed with code $LASTEXITCODE"
  }
}

function Invoke-CompressFolder {
  param(
    [Parameter(Mandatory)] [string]$SourceFolder,
    [Parameter(Mandatory)] [string]$ZipPath
  )
  if (-not (Test-Path -LiteralPath $SourceFolder)) {
    throw "Source folder not found: $SourceFolder"
  }
  $zipDir = Split-Path -Parent $ZipPath
  if (-not (Test-Path -LiteralPath $zipDir)) {
    New-Item -ItemType Directory -Path $zipDir | Out-Null
  }
  if (Test-Path -LiteralPath $ZipPath) {
    Remove-Item -LiteralPath $ZipPath -Force
  }
  Compress-Archive -Path (Join-Path $SourceFolder '*') -DestinationPath $ZipPath -Force
  if (Test-Path -LiteralPath $ZipPath) { $global:Backups += $ZipPath }
}

# --- Цели бэкапа --------------------------------------------------------------

function Invoke-BackupSingle {
  param([string]$OutDir)

  Write-Host "-> Building single version (vite)..." -ForegroundColor Cyan
  $runner = Get-PackageRunner
  $pkg    = Get-Content (Join-Path $ProjectRoot 'package.json') -Raw | ConvertFrom-Json
  $scriptToRun = if ($pkg.scripts.'build:single') { 'build:single' } else { 'build' }

  Push-Location $ProjectRoot
  & $runner run $scriptToRun
  $code = $LASTEXITCODE
  Pop-Location
  if ($code -ne 0) { throw "Build failed with code $code" }

  $dist = Join-Path $ProjectRoot 'dist'
  if (-not (Test-Path -LiteralPath $dist)) {
    throw "Dist folder not found after build."
  }

  $tag    = New-BackupTag
  $zipOut = Join-Path $OutDir "urbanvision-single-$tag.zip"
  Write-Host "-> Packing dist -> $zipOut" -ForegroundColor Cyan
  Invoke-CompressFolder -SourceFolder $dist -ZipPath $zipOut
  return $zipOut
}

function Invoke-BackupVSCode {
  param([string]$OutDir)

  $tag    = New-BackupTag
  $temp   = New-TempDirectory -Prefix "uv-vscode"
  $zipOut = Join-Path $OutDir "urbanvision-vscode-$tag.zip"

  Write-Host "-> Copying project for VSCode to temp folder..." -ForegroundColor Cyan
  $exclude = @('.git','node_modules','.next','dist','build','out','coverage','.cache','tmp','temp','.turbo','.vite','.pnpm-store')
  Invoke-RoboCopyMirror -Source $ProjectRoot -Destination $temp -ExcludeDirs $exclude

  Write-Host "-> Archiving VSCode package -> $zipOut" -ForegroundColor Cyan
  Invoke-CompressFolder -SourceFolder $temp -ZipPath $zipOut

  Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
  return $zipOut
}

function Invoke-BackupGitHub {
  param([string]$OutDir)

  $tag    = New-BackupTag
  $temp   = New-TempDirectory -Prefix "uv-github"
  $zipOut = Join-Path $OutDir "urbanvision-github-$tag.zip"

  Write-Host "-> Copying project for GitHub (with .git history)..." -ForegroundColor Cyan
  $exclude = @('node_modules','.next','dist','build','out','coverage','.cache','tmp','temp','.turbo','.vite','.pnpm-store')
  Invoke-RoboCopyMirror -Source $ProjectRoot -Destination $temp -ExcludeDirs $exclude

  Write-Host "-> Archiving GitHub package -> $zipOut" -ForegroundColor Cyan
  Invoke-CompressFolder -SourceFolder $temp -ZipPath $zipOut

  Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
  return $zipOut
}

# --- Запуск по параметрам -----------------------------------------------------

if (-not (Test-Path -LiteralPath $OutDir)) {
  New-Item -ItemType Directory -Path $OutDir | Out-Null
}

switch ($Target) {
  'single' {
    Invoke-BackupSingle -OutDir $OutDir | Out-Null
  }
  'vscode' {
    Invoke-BackupVSCode -OutDir $OutDir | Out-Null
  }
  'github' {
    Invoke-BackupGitHub -OutDir $OutDir | Out-Null
  }
  'all' {
    Invoke-BackupSingle  -OutDir $OutDir | Out-Null
    Invoke-BackupVSCode  -OutDir $OutDir | Out-Null
    Invoke-BackupGitHub  -OutDir $OutDir | Out-Null
  }
}

Write-Host ""

# Итоги
$existing = @()
foreach ($path in $global:Backups) {
    if ($path -and 
        $path -is [string] -and 
        $path.Trim() -ne "" -and 
        $path.ToLower().EndsWith(".zip") -and
        (Test-Path -LiteralPath $path -ErrorAction SilentlyContinue)) {
        $existing += $path
    }
}

Write-Host "Done. Created archives:" -ForegroundColor Green
if ($existing.Count -gt 0) {
    foreach ($p in $existing) {
        $fi = Get-Item -LiteralPath $p -ErrorAction SilentlyContinue
        if ($fi) {
            Write-Host (" - {0}  ({1:N1} MB)" -f $fi.Name, ($fi.Length / 1MB)) -ForegroundColor Yellow
        }
    }
    exit 0
} else {
    Write-Host "  No archives created." -ForegroundColor Red
    exit 1
}