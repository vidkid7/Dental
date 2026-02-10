-- Check all updated emails
SELECT 'Users' as table_name, email, name FROM users
UNION ALL
SELECT 'Doctors' as table_name, email, name FROM doctors
UNION ALL
SELECT 'Clinics' as table_name, email, name FROM clinics
ORDER BY table_name, email;
