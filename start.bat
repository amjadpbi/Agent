@echo off
echo ================================================
echo   ShopAgent - Starting Development Server...
echo ================================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [!] node_modules not found. Running npm install first...
    npm install --force
    echo.
)

:: Start the Vite dev server
echo [*] Starting server at http://localhost:5173
echo [*] Press CTRL+C to stop.
echo.
npm run dev

pause
