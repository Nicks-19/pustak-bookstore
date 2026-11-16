@echo off
title Pustak - Smart Academic Bookstore & Circular Inventory Management Platform
color 0B
echo ===============================================================================
echo                PUSTAK BOOKSTORE MANAGEMENT PLATFORM
echo          Student: Nikita Sharad Pawar  ^|  PRN: 202401100018  ^|  Roll: A19
echo ===============================================================================
echo.
echo [1/3] Verifying Python runtime environment...
python --version
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

echo.
echo [2/3] Installing dependencies (FastAPI, Uvicorn, Pydantic)...
pip install -r backend\requirements.txt --quiet

echo.
echo [3/3] Launching Pustak Full-Stack Server at http://127.0.0.1:8000 ...
echo [INFO] Swagger API Docs available at http://127.0.0.1:8000/docs
echo [INFO] Press Ctrl+C in this terminal window to stop the server.
echo.

start "" "http://127.0.0.1:8000"
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

pause
