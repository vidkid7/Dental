@echo off
echo Updating database user passwords to Admin@123...
echo.

REM Load environment variables from .env file
for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr /v "^#"') do (
    set %%a=%%b
)

REM Run the SQL update script
psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d %DATABASE_NAME% -f database/update_passwords.sql

echo.
echo Password update complete!
echo All users now have password: Admin@123
echo.
pause
