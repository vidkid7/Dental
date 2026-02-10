-- Update all user passwords to Admin@123
-- Bcrypt hash for Admin@123: $2b$10$ikUlxQ8UQd4aDIU2jRqoBOGIhgEgc7INYc4jjPMOqSQKP63PxqgNe

UPDATE users 
SET password = '$2b$10$ikUlxQ8UQd4aDIU2jRqoBOGIhgEgc7INYc4jjPMOqSQKP63PxqgNe',
    updated_at = NOW()
WHERE email IN (
  'superadmin@omchabahildental.com.np',
  'admin@premierdentalcollege.edu',
  'admin@omchabahildental.com.np',
  'staff@omchabahildental.com.np',
  'admin@dental.com'
);

-- Display updated users
SELECT email, name, role, updated_at 
FROM users 
WHERE email IN (
  'superadmin@omchabahildental.com.np',
  'admin@premierdentalcollege.edu',
  'admin@omchabahildental.com.np',
  'staff@omchabahildental.com.np',
  'admin@dental.com'
);
