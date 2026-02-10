-- Update all user emails to remove .np extension
UPDATE users 
SET email = REPLACE(email, '.com.np', '.com') 
WHERE email LIKE '%.com.np';



-- Display updated user emails
SELECT email, name, role FROM users ORDER BY role, name;
