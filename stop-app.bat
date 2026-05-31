@echo off
title Stop Japanese Flashcards Server
cd /d "%~dp0"
echo ==========================================================
echo   Stopping Japanese Flashcards Server...
echo ==========================================================
echo.
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*vite*' } | Stop-Process -Force"
echo.
echo ==========================================================
echo   Server stopped successfully!
echo ==========================================================
timeout /t 2 >nul
