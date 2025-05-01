@echo off
echo Husky is running! [PowerShell CMD version]
npx lint-staged
exit /b %ERRORLEVEL%