const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'dental_db',
});

async function uploadVideos() {
  console.log('\n' + '='.repeat(70));
  console.log('🎬  UPLOADING VIDEOS TO DATABASE');
  console.log('='.repeat(70) + '\n');

  const client = await pool.connect();

  try {
    console.log('✅ Connected to local database\n');

    // Source and destination paths
    const sourceVideoDir = path.join(__dirname, '..', '..', 'video');
    const destVideoDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'video');

    // Ensure destination directory exists
    if (!fs.existsSync(destVideoDir)) {
      fs.mkdirSync(destVideoDir, { recursive: true });
      console.log('✅ Created video directory in frontend/public\n');
    }

    // Check if source directory exists
    if (!fs.existsSync(sourceVideoDir)) {
      console.error('❌ Source video directory not found:', sourceVideoDir);
      return;
    }

    // Get all video files
    const videoFiles = fs.readdirSync(sourceVideoDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.webm', '.mov', '.avi'].includes(ext);
    });

    if (videoFiles.length === 0) {
      console.log('⚠️  No video files found in /video directory\n');
      return;
    }

    console.log(`📊 Found ${videoFiles.length} video files\n`);
    console.log('🔄 Processing videos...\n');

    let uploaded = 0;
    let skipped = 0;

    for (const filename of videoFiles) {
      const sourcePath = path.join(sourceVideoDir, filename);
      const stats = fs.statSync(sourcePath);
      const fileSize = stats.size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const newFilename = `${timestamp}-${sanitizedName}`;
      const destPath = path.join(destVideoDir, newFilename);

      // Copy file to frontend/public/video
      try {
        fs.copyFileSync(sourcePath, destPath);
      } catch (error) {
        console.log(`   ❌ ${filename} - Failed to copy: ${error.message}`);
        continue;
      }

      // Create database entry
      const url = `/video/${newFilename}`;
      const mimeType = 'video/mp4'; // Default to mp4

      try {
        // Check if already exists
        const existing = await client.query(
          'SELECT id FROM media_files WHERE name = $1',
          [filename]
        );

        if (existing.rows.length > 0) {
          console.log(`   ⚠️  ${filename} (${fileSizeMB} MB) - Already exists, skipping`);
          skipped++;
          // Delete the copied file since it already exists
          fs.unlinkSync(destPath);
          continue;
        }

        // Insert into database
        await client.query(`
          INSERT INTO media_files (
            name, url, public_id, type, mime_type, size, folder, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `, [filename, url, newFilename, 'video', mimeType, fileSize, 'gallery']);

        console.log(`   ✅ ${filename} (${fileSizeMB} MB)`);
        uploaded++;

      } catch (error) {
        console.log(`   ❌ ${filename} - Database error: ${error.message}`);
        // Delete the copied file if database insert failed
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
        }
      }
    }

    // Get total count
    const countResult = await client.query(
      "SELECT COUNT(*) FROM media_files WHERE type = 'video'"
    );
    const totalVideos = countResult.rows[0].count;

    console.log('\n' + '='.repeat(70));
    console.log('✅ VIDEO UPLOAD COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log(`   📊 Videos processed: ${videoFiles.length}`);
    console.log(`   ✅ New uploads: ${uploaded}`);
    console.log(`   ⚠️  Skipped (duplicates): ${skipped}`);
    console.log(`   📹 Total videos in database: ${totalVideos}`);
    console.log('');
    console.log('='.repeat(70));
    console.log('📍 Videos saved to: frontend/public/video/');
    console.log('🌐 Access at: http://localhost:3002/video/{filename}');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

uploadVideos().catch(error => {
  console.error('\n❌ Process failed:', error.message);
  process.exit(1);
});
