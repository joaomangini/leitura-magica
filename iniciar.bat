@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo    Leitura Magica
echo    Abrindo no Google Chrome...
echo    Para PARAR o app: feche a janela do servidor.
echo ============================================
echo.

rem Inicia o servidor numa janela separada
start "Leitura Magica - servidor (NAO FECHE para manter o app no ar)" cmd /c "npx -y serve -l 3000 ."

rem Espera o servidor subir e abre no Chrome
timeout /t 4 >nul
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
  start "" "%CHROME%" "http://localhost:3000"
) else (
  start "" "http://localhost:3000"
)
