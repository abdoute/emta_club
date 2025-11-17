@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Change to project root (this script's directory)
cd /d %~dp0

REM --- Detect Python launcher or python.exe ---
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  set PY_CMD=py -3
) else (
  where python >nul 2>&1
  if %ERRORLEVEL% EQU 0 (
    set PY_CMD=python
  ) else (
    echo [error] Python 3 is not installed or not in PATH.
    echo         Download from https://www.python.org/downloads/ and check "Add python.exe to PATH" during setup.
    pause
    exit /b 1
  )
)

REM 1) Create virtual environment if missing
if not exist .venv (
  echo [setup] Creating virtual environment .venv ...
  %PY_CMD% -m venv .venv
  if errorlevel 1 (
    echo [error] Failed to create virtual environment. Verify Python 3 installation.
    pause
    exit /b 1
  )
)

REM 2) Use venv python directly (no activation required)
set VENV_PY=.venv\Scripts\python.exe
if not exist "%VENV_PY%" (
  echo [error] Virtual environment seems incomplete: "%VENV_PY%" not found.
  echo         Try deleting the .venv folder and re-running this script.
  pause
  exit /b 1
)

REM 3) Upgrade pip and install dependencies
echo [setup] Upgrading pip ...
"%VENV_PY%" -m pip install --upgrade pip >nul 2>&1

if exist backend\requirements.txt (
  echo [setup] Installing requirements from backend\requirements.txt ...
  "%VENV_PY%" -m pip install -r backend\requirements.txt
) else (
  echo [setup] Installing Flask backend dependencies ...
  "%VENV_PY%" -m pip install flask flask-cors flask-sqlalchemy python-dotenv flask-jwt-extended
)

REM 4) Run the Flask app via backend/run.py (loads .env automatically)
echo [run] Starting backend on http://127.0.0.1:5000 ...
echo [hint] Close this window to stop the server.
"%VENV_PY%" backend\run.py
if errorlevel 1 (
  echo.
  echo [error] Backend exited with an error. Check messages above.
  pause
)

endlocal
