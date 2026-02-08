const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrateVideos() {
  console.log('\n' + '='.repeat(70));
  console.log('📦  MIGRATE VIDEOS TO BACKEND UPLOADS');
  console.log('='.repeat(70) + '\n');

  // Setup paths
  const frontendVideoDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'video');
  const backendVideoDir = path.join(__dirname, '..', 'uploads', 'video');

  // Create backend uploads directory
  if (!fs.existsSync(backendVideoDir)) {
    fs.mkdirSync(backendVideoDir, { recursive: true });
    console.log('✅ Created backend/uploads/video directory\n');
  }

  // Check if frontend videos exist
  if (!fs.existsSync(frontendVideoDir)) {
    console.error('❌ Frontend video directory not found');
    return;
  }

  // Get all video files
  const videoFiles = fs.readdirSync(frontendVideoDir);

  if (videoFiles.length === 0) {
    console.log('⚠️  No videos found in frontend/public/video\n');
    return;
  }

  console.log(`📊 Found ${videoFiles.length} videos to migrate\n`);
  console.log('🔄 Copying videos...\n');

  let copied = 0;

  for (const filename of videoFiles) {
    const sourcePath = path.join(frontendVideoDir, filename);
    const destPath = path.join(backendVideoDir, filename);

    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✅ ${filename}`);
      copied++;
    } catch (error) {
      console.log(`   ❌ ${filename} - ${error.message}`);
    }
  }

  console.log('\n📊 Updating database URLs...\n');

  // Update database
  const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'dental_db',
  });

  const client = await pool.connect();

  try {
    // Update all video URLs to use /uploads prefix
    const result = await client.query(`
      UPDATE media_files 
      SET url = '/uploads' || url, updated_at = NOW()
      WHERE type = 'video' AND url NOT LIKE '/uploads%'
      RETURNING name, url
    `);

    console.log(`   ✅ Updated ${result.rows.length} database records\n`);

    console.log('='.repeat(70));
    console.log('✅ MIGRATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log(`   📦 Videos copied: ${copied}`);
    console.log(`   📊 Database updated: ${result.rows.length}`);
    console.log('');
    console.log('='.repeat(70));
    console.log('📍 Videos location: backend/uploads/video/');
    console.log('🌐 Accessible at: http://localhost:3001/uploads/video/{filename}');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Database update failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateVideos().catch(error => {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
});
