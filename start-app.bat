@echo off
title Antigravity Japanese Flashcards Launcher
echo ==========================================================
echo   Antigravity Japanese Flashcards Launcher
echo ==========================================================
echo.
cd /d "%~dp0"

:: Check if node_modules folder exists, if not install dependencies
if not exist node_modules (
    echo [INFO] node_modules not found. Installing project dependencies...
    call npm install
)

:: Launch the Vite development server silently in the background
echo [INFO] Spinning up Vite development server silently in background...
wscript.exe "%~dp0run-hidden.vbs"

echo.
echo ==========================================================
echo   Application launched successfully in the background!
echo   This window will now close automatically.
echo   To stop the server at any time, run stop-app.bat
echo ==========================================================
timeout /t 3 >nul
