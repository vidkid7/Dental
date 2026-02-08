const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const RAILWAY_URL = 'postgresql://postgres:vNmzLSyojiGfYYYWWFriXwmbfQnoTxhZ@mainline.proxy.rlwy.net:29325/railway';

async function migrateToCloudinary() {
  console.log('\n' + '='.repeat(70));
  console.log('☁️  MIGRATE VIDEOS TO CLOUDINARY');
  console.log('='.repeat(70) + '\n');

  // Check Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Cloudinary credentials not configured in .env');
    console.log('\nPlease add to your .env file:');
    console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('CLOUDINARY_API_KEY=your_api_key');
    console.log('CLOUDINARY_API_SECRET=your_api_secret');
    console.log('\nGet free account at: https://cloudinary.com/');
    return;
  }

  const pool = new Pool({
    connectionString: RAILWAY_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('✅ Connected to Railway database\n');

    // Get all video files from database
    const result = await client.query(
      "SELECT * FROM media_files WHERE type = 'video' ORDER BY created_at"
    );

    const videos = result.rows;

    if (videos.length === 0) {
      console.log('⚠️  No videos found in database\n');
      return;
    }

    console.log(`📊 Found ${videos.length} videos to migrate\n`);
    console.log('🔄 Uploading to Cloudinary...\n');

    let uploaded = 0;
    let failed = 0;

    for (const video of videos) {
      const localPath = path.join(__dirname, '..', '..', 'frontend', 'public', video.url);

      if (!fs.existsSync(localPath)) {
        console.log(`   ⚠️  ${video.name} - File not found locally, skipping`);
        failed++;
        continue;
      }

      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localPath, {
          resource_type: 'video',
          folder: 'dental-videos',
          public_id: video.public_id,
        });

        // Update database with Cloudinary URL
        await client.query(
          `UPDATE media_files 
           SET url = $1, public_id = $2, updated_at = NOW() 
           WHERE id = $3`,
          [uploadResult.secure_url, uploadResult.public_id, video.id]
        );

        console.log(`   ✅ ${video.name} → ${uploadResult.secure_url}`);
        uploaded++;

      } catch (error) {
        console.log(`   ❌ ${video.name} - Upload failed: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ MIGRATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log(`   📊 Total videos: ${videos.length}`);
    console.log(`   ✅ Uploaded: ${uploaded}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('');
    console.log('='.repeat(70));
    console.log('☁️  Videos are now served from Cloudinary');
    console.log('🌐 Accessible from Railway deployment');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateToCloudinary().catch(error => {
  console.error('\n❌ Process failed:', error.message);
  process.exit(1);
});
