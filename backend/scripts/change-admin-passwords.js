const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function changePasswords() {
  console.log('\n' + '='.repeat(70));
  console.log('🔐  CHANGE ADMIN PASSWORDS FOR RAILWAY');
  console.log('='.repeat(70) + '\n');

  // Get Railway database URL
  console.log('📝 Enter your Railway PostgreSQL connection URL:');
  console.log('   (Get it from: Railway Dashboard → PostgreSQL → Variables → DATABASE_URL)\n');
  
  const databaseUrl = await question('Railway Database URL: ');

  if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
    console.error('\n❌ Invalid database URL');
    rl.close();
    process.exit(1);
  }

  // Get new password
  console.log('\n🔑 Enter new password for all admin accounts:');
  console.log('   (Must be at least 8 characters, include uppercase, lowercase, number, and special character)\n');
  
  const newPassword = await question('New Password: ');

  if (newPassword.length < 8) {
    console.error('\n❌ Password must be at least 8 characters long');
    rl.close();
    process.exit(1);
  }

  // Confirm password
  const confirmPassword = await question('Confirm Password: ');

  if (newPassword !== confirmPassword) {
    console.error('\n❌ Passwords do not match');
    rl.close();
    process.exit(1);
  }

  console.log('\n⚠️  This will change passwords for:');
  console.log('   1. superadmin@omchabahildental.com.np (Super Admin)');
  console.log('   2. admin@omchabahildental.com.np (Admin)');
  console.log('   3. staff@omchabahildental.com.np (Staff)\n');

  const confirm = await question('Type "YES" to continue: ');

  if (confirm !== 'YES') {
    console.log('\n❌ Password change cancelled');
    rl.close();
    process.exit(0);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('\n🔄 Hashing password...\n');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('📊 Updating passwords...\n');

    // Update all three admin users
    const users = [
      'superadmin@omchabahildental.com.np',
      'admin@omchabahildental.com.np',
      'staff@omchabahildental.com.np'
    ];

    for (const email of users) {
      const result = await client.query(
        `UPDATE users 
         SET password = $1, updated_at = NOW() 
         WHERE email = $2
         RETURNING email, name, role`,
        [hashedPassword, email]
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`   ✅ ${user.email} (${user.role})`);
      } else {
        console.log(`   ⚠️  ${email} - User not found`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ PASSWORDS UPDATED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('');
    console.log('🔐 Updated Login Credentials:');
    console.log('');
    console.log('   Super Admin:');
    console.log('   Email: superadmin@omchabahildental.com.np');
    console.log(`   Password: ${newPassword}`);
    console.log('');
    console.log('   Admin:');
    console.log('   Email: admin@omchabahildental.com.np');
    console.log(`   Password: ${newPassword}`);
    console.log('');
    console.log('   Staff:');
    console.log('   Email: staff@omchabahildental.com.np');
    console.log(`   Password: ${newPassword}`);
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
    rl.close();
  }
}

changePasswords().catch(error => {
  rl.close();
  console.error('\n❌ Process failed:', error.message);
  process.exit(1);
});
