@echo off
setlocal enabledelayedexpansion

:: CuteFinance PWA - Windows Uninstaller
:: Version 2.0.0

:: Colors
color 0C

:: Banner
echo.
echo   ____      _   _   ___                  _ _____ _   _  ___ _____ ____  
echo  / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| 
echo ^| ^|   / _` ^| __^| ^|  ^|^| '_ \ / _` ^|/ _ \ ^|  _^| ^|  \| ^| ^| ^|^| ^| \___ \ 
echo ^| ^|__^| (_^| ^| ^|_^| ^|  ^|^| ^| ^| ^| (_^| ^|  __/ ^| ^|___^| ^|\  ^| ^|_^| ^|^| ^|  ___) ^|
echo  \____\__,_^|\__^|_^| ^|___^|_^| ^|_^\__, ^|\___^|_^|_____^|_^| \_^\___/ ^|^| ^|____/ 
echo                                 ^|___/                                     
echo.
echo 🐾 CuteFinance PWA Uninstaller v2.0.0
echo.

:: Warning
echo ⚠️  WARNING: This will uninstall CuteFinance PWA
echo.
echo This will:
echo   • Stop the server if running
echo   • Delete Windows service (if exists)
echo   • Remove desktop shortcut (if exists)
echo   • Remove from PATH (if added)
echo   • Optionally delete all data
echo.

:: Confirmation
echo Are you sure you want to uninstall? (y/n)
set /p CONFIRM=
if /i not "%CONFIRM%"=="y" (
    echo Uninstallation cancelled.
    pause
    exit /b 0
)

echo.

:: Step 1: Stop server
echo [1/6] Stopping server...
taskkill /f /im cute-finance.exe >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ Server stopped
) else (
    echo ℹ️  Server not running
)
echo.

:: Step 2: Stop and delete Windows service
echo [2/6] Removing Windows service...
sc stop CuteFinance >nul 2>&1
sc delete CuteFinance >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ Windows service removed
) else (
    echo ℹ️  Windows service not found
)
echo.

:: Step 3: Remove desktop shortcut
echo [3/6] Removing desktop shortcut...
set USERPROFILE_DIR=%USERPROFILE%\Desktop
set SHORTCUT_FILE=%USERPROFILE_DIR%\CuteFinance.lnk

if exist "%SHORTCUT_FILE%" (
    del "%SHORTCUT_FILE%"
    echo ✅ Desktop shortcut removed
) else (
    echo ℹ️  Desktop shortcut not found
)
echo.

:: Step 4: Remove from PATH
echo [4/6] Removing from PATH...
echo ℹ️  Note: Manual PATH removal may be required
echo    Open System Properties ^> Environment Variables
echo    Remove CuteFinance path from PATH variable
echo.

:: Step 5: Delete binary
echo [5/6] Removing binary files...
if exist cute-finance.exe (
    del cute-finance.exe
    echo ✅ Binary removed
) else (
    echo ℹ️  Binary not found
)
echo.

:: Step 6: Delete data (optional)
echo [6/6] Data Management
echo.
echo Do you want to delete all data? (y/n)
echo ⚠️  WARNING: This cannot be undone!
set /p DELETE_DATA=

if /i "%DELETE_DATA%"=="y" (
    echo.
    echo Are you REALLY sure? Type "YES" to confirm:
    set /p FINAL_CONFIRM=
    
    if /i "!FINAL_CONFIRM!"=="YES" (
        echo.
        echo Deleting data...
        
        if exist data (
            rmdir /s /q data
            echo ✅ Data directory deleted
        ) else (
            echo ℹ️  Data directory not found
        )
        
        if exist dist (
            rmdir /s /q dist
            echo ✅ Frontend build deleted
        ) else (
            echo ℹ️  Frontend build not found
        )
    ) else (
        echo Data deletion cancelled.
        echo Data preserved in: .\data
    )
) else (
    echo Data preserved in: .\data
)

echo.

:: Cleanup node_modules (optional)
echo Do you want to delete node_modules? (y/n)
set /p DELETE_NODE=
if /i "%DELETE_NODE%"=="y" (
    if exist node_modules (
        echo Deleting node_modules...
        rmdir /s /q node_modules
        echo ✅ node_modules deleted
    ) else (
        echo ℹ️  node_modules not found
    )
) else (
    echo node_modules preserved
)

echo.

:: Success message
echo =========================================
echo   ✅ Uninstallation Complete!
echo =========================================
echo.
echo 📝 Summary:
echo   • Server stopped
echo   • Windows service removed
echo   • Desktop shortcut removed
echo   • Binary deleted
if /i "%DELETE_DATA%"=="y" (
    if /i "!FINAL_CONFIRM!"=="YES" (
        echo   • All data deleted
    ) else (
        echo   • Data preserved in: .\data
    )
) else (
    echo   • Data preserved in: .\data
)
echo.
echo 💡 To reinstall:
echo   • Run installer-windows.bat
echo.
echo 📚 Documentation:
echo   • README.md
echo   • INSTALL.md
echo.
pause
