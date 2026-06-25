param(
  [Parameter(Mandatory=$true)]
  [string]$Domain
)

$ErrorActionPreference = "Stop"

if ($Domain -notmatch "^https://[a-zA-Z0-9.-]+(:[0-9]+)?/?$") {
  throw "Domain must be an https URL, for example https://aicostradar.com"
}

$cleanDomain = $Domain.TrimEnd("/")
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -Path $root -Recurse -File -Include *.html,*.xml,*.txt,*.md |
  Where-Object { $_.FullName -notmatch "\\qa-result\.json$" }

foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $updated = $text.Replace("https://example.com", $cleanDomain)
  if ($updated -ne $text) {
    Set-Content -LiteralPath $file.FullName -Value $updated -Encoding UTF8
    Write-Host "updated $($file.FullName)"
  }
}

Write-Host "Domain set to $cleanDomain"
