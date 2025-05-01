@echo off
echo Husky is running! [CMD version]
npx lint-staged
exit /b %ERRORLEVEL%