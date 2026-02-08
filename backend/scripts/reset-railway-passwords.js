const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Railway Database URL
const RAILWAY_URL = 'postgresql://postgres:vNmzLSyojiGfYYYWWFriXwmbfQnoTxhZ@mainline.proxy.rlwy.net:29325/railway';

// New strong password for all admin accounts
const NEW_PASSWORD = 'Admin@123';

async function resetPasswords() {
  console.log('\n' + '='.repeat(70));
  console.log('🔐  RESET RAILWAY ADMIN PASSWORDS');
  console.log('='.repeat(70) + '\n');

  const pool = new Pool({
    connectionString: RAILWAY_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('✅ Connected to Railway database\n');
    console.log('🔄 Hashing new password...\n');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    console.log('📊 Updating passwords for all admin users...\n');

    // Update all three admin users
    const users = [
      { email: 'superadmin@omchabahildental.com.np', role: 'Super Admin' },
      { email: 'admin@omchabahildental.com.np', role: 'Admin' },
      { email: 'staff@omchabahildental.com.np', role: 'Staff' }
    ];

    for (const user of users) {
      const result = await client.query(
        `UPDATE users 
         SET password = $1, updated_at = NOW() 
         WHERE email = $2
         RETURNING email, name, role`,
        [hashedPassword, user.email]
      );

      if (result.rows.length > 0) {
        console.log(`   ✅ ${user.email} (${user.role})`);
      } else {
        console.log(`   ⚠️  ${user.email} - User not found`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL PASSWORDS UPDATED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('');
    console.log('🔐 New Login Credentials for Railway:');
    console.log('');
    console.log('   Super Admin:');
    console.log('   Email: superadmin@omchabahildental.com.np');
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('');
    console.log('   Admin:');
    console.log('   Email: admin@omchabahildental.com.np');
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('');
    console.log('   Staff:');
    console.log('   Email: staff@omchabahildental.com.np');
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log('');
    console.log('='.repeat(70));
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Password update failed:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

resetPasswords().catch(error => {
  console.error('\n❌ Process failed:', error.message);
  process.exit(1);
});
