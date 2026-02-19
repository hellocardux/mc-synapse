@echo off
cd /d "%~dp0"
echo ==========================================
echo Starting MC Synapse Development Server...
echo ==========================================
echo.
echo If the browser does not open automatically, please visit:
echo http://localhost:5173
echo.
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo Error occurred. Please check the output above.
    pause
)
pause
