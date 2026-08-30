Set-Location c:\Users\Gaurav\OneDrive\Desktop\coscom
$p = Start-Process -FilePath 'node' -ArgumentList 'node_modules/vite/bin/vite.js','preview','--port','4183' -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 6
try {
  $html = (Invoke-WebRequest -Uri 'http://localhost:4183/' -UseBasicParsing -TimeoutSec 20).Content
} finally {
  Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
foreach ($c in @('relative isolate','pointer-events-none fixed inset-0 -z-20','pointer-events-none fixed inset-0 -z-10','All rights reserved','Built for the next century of money','github.com','linkedin.com','discord.com')) {
  Write-Output ($c + ' => ' + ($html -like ('*' + $c + '*')))
}
$css = Get-Content '.output/public/assets/styles-DEyXdP19.css' -Raw
Write-Output ('css .-z-20 => ' + ($css -match [regex]::Escape('.-z-20')))
Write-Output ('css .-z-10 => ' + ($css -match [regex]::Escape('.-z-10')))
Write-Output ('css .isolate => ' + ($css -match [regex]::Escape('.isolate')))
