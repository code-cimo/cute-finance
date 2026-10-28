@echo off
setlocal enabledelayedexpansion

:: CuteFinance PWA - Windows Installer
:: Version 2.0.0

:: Colors
color 0B

:: Banner
echo.
echo   ____      _   _   ___                  _ _____ _   _  ___ _____ ____  
echo  / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| 
echo ^| ^|   / _` ^| __^| ^|  ^|^| '_ \ / _` ^|/ _ \ ^|  _^| ^|  \| ^| ^| ^|^| ^| \___ \ 
echo ^| ^|__^| (_^| ^| ^|_^| ^|  ^|^| ^| ^| ^| (_^| ^|  __/ ^| ^|___^| ^|\  ^| ^|_^| ^|^| ^|  ___) ^|
echo  \____\__,_^|\__^|_^| ^|___^|_^| ^|_^\__, ^|\___^|_^|_____^|_^| \_^\___/ ^|^| ^|____/ 
echo                                 ^|___/                                     
echo.
echo 🐾 CuteFinance PWA Installer v2.0.0
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Warning: Not running as administrator
    echo    Some features may not work properly
    echo.
    pause
)

:: Step 1: Check Go installation
echo [1/6] Checking Go installation...
where go >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Go is not installed!
    echo.
    echo Please download and install Go from:
    echo https://go.dev/dl/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('go version') do set GO_VERSION=%%i
echo ✅ %GO_VERSION%
echo.

:: Step 2: Check Node.js installation
echo [2/6] Checking Node.js installation...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Node.js is not installed
    echo    Frontend will not be built
    echo    Download from: https://nodejs.org/
    echo.
    set BUILD_FRONTEND=0
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✅ Node.js %NODE_VERSION%
    set BUILD_FRONTEND=1
)
echo.

:: Step 3: Configure port
echo [3/6] Configure Port
set /p PORT="Enter port (default: 8080): "
if "!PORT!"=="" set PORT=8080

:: Validate port
echo !PORT!| findstr /r "^[0-9][0-9]*$" >nul
if %errorLevel% neq 0 (
    echo ❌ Invalid port number!
    pause
    exit /b 1
)

echo ✅ Port: %PORT%
echo.

:: Step 4: Configure data directory
echo [4/6] Configure Data Directory
set /p DATA_DIR="Enter data directory (default: .\data): "
if "!DATA_DIR!"=="" set DATA_DIR=.\data

echo ✅ Data directory: %DATA_DIR%

:: Create data directory
if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"
echo.

:: Step 5: Setup dependencies
echo [5/6] Setting up dependencies...
echo.

:: Clean old go.sum
if exist go.sum del go.sum

:: Download dependencies
echo Downloading Go dependencies...
go mod download
if %errorLevel% neq 0 (
    echo ❌ Failed to download dependencies!
    pause
    exit /b 1
)

:: Tidy modules
echo Tidying modules...
go mod tidy
if %errorLevel% neq 0 (
    echo ❌ Failed to tidy modules!
    pause
    exit /b 1
)

echo ✅ Dependencies ready
echo.

:: Step 6: Build frontend (if Node.js available)
if "%BUILD_FRONTEND%"=="1" (
    echo [6/6] Building frontend...
    echo.
    
    echo Installing npm dependencies...
    call npm install
    if %errorLevel% neq 0 (
        echo ⚠️  Failed to install npm dependencies
        echo    Continuing without frontend...
        goto :build_go
    )
    
    echo Building frontend...
    call npm run build
    if %errorLevel% neq 0 (
        echo ⚠️  Failed to build frontend
        echo    Continuing without frontend...
        goto :build_go
    )
    
    echo ✅ Frontend built successfully
    echo.
) else (
    echo [6/6] Skipping frontend build (Node.js not available)
    echo.
)

:build_go
:: Build Go application
echo Building Go application...
go build -ldflags="-w -s" -o cute-finance.exe ./cmd/server
if %errorLevel% neq 0 (
    echo ❌ Failed to build Go application!
    pause
    exit /b 1
)

echo ✅ Build complete
echo.

:: Save configuration
echo Saving configuration...
(
    echo {
    echo   "port": %PORT%,
    echo   "data_dir": "%DATA_DIR%"
    echo }
) > "%DATA_DIR%\config.json"

echo ✅ Configuration saved to %DATA_DIR%\config.json
echo.

:: Create Windows service (optional)
echo Would you like to create a Windows service? (y/n)
set /p CREATE_SERVICE=
if /i "%CREATE_SERVICE%"=="y" (
    echo.
    echo Creating Windows service...
    
    :: Get current directory
    set CURRENT_DIR=%CD%
    
    :: Create service using sc
    sc create CuteFinance binPath= "\"%CURRENT_DIR%\cute-finance.exe\" -port %PORT% -data \"%CURRENT_DIR%\%DATA_DIR%\"" start= auto DisplayName= "CuteFinance PWA"
    if %errorLevel% equ 0 (
        echo ✅ Windows service created
        echo.
        echo To start service: net start CuteFinance
        echo To stop service: net stop CuteFinance
        echo To delete service: sc delete CuteFinance
    ) else (
        echo ⚠️  Failed to create Windows service
        echo    You may need to run as administrator
    )
    echo.
)

:: Create desktop shortcut (optional)
echo Would you like to create a desktop shortcut? (y/n)
set /p CREATE_SHORTCUT=
if /i "%CREATE_SHORTCUT%"=="y" (
    echo.
    echo Creating desktop shortcut...
    
    set USERPROFILE_DIR=%USERPROFILE%\Desktop
    set SHORTCUT_FILE=%USERPROFILE_DIR%\CuteFinance.lnk
    
    :: Create shortcut using PowerShell
    powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_FILE%'); $Shortcut.TargetPath = '%CD%\cute-finance.exe'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.IconLocation = '%CD%\cute-finance.exe,0'; $Shortcut.Description = 'CuteFinance PWA'; $Shortcut.Save()"
    
    if exist "%SHORTCUT_FILE%" (
        echo ✅ Desktop shortcut created
    ) else (
        echo ⚠️  Failed to create desktop shortcut
    )
    echo.
)

:: Add to PATH (optional)
echo Would you like to add CuteFinance to PATH? (y/n)
set /p ADD_TO_PATH=
if /i "%ADD_TO_PATH%"=="y" (
    echo.
    echo Adding to PATH...
    
    :: Add to user PATH
    setx PATH "%PATH%;%CD%" >nul 2>&1
    if %errorLevel% equ 0 (
        echo ✅ Added to PATH
        echo    You may need to restart your terminal
    ) else (
        echo ⚠️  Failed to add to PATH
    )
    echo.
)

:: Success message
echo =========================================
echo   ✅ Installation Complete!
echo =========================================
echo.
echo 📝 How to run:
echo    cute-finance.exe
echo.
echo 🌐 Access application:
echo    http://localhost:%PORT%
echo.
echo 💡 Tips:
echo    • Press Ctrl+C to stop server
echo    • Data saved in: %DATA_DIR%
echo    • Config saved in: %DATA_DIR%\config.json
echo    • To uninstall: run uninstaller-windows.bat
echo.
echo 📚 Documentation:
echo    • README.md
echo    • INSTALL.md
echo    • USAGE.md
echo.
pause
