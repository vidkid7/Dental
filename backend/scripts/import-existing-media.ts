import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { MediaFile, MediaType } from '../src/modules/media/entities/media.entity';

// Database configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'dental_user',
  password: process.env.DATABASE_PASSWORD || 'dental_password',
  database: process.env.DATABASE_NAME || 'dental_db',
  entities: [MediaFile],
  synchronize: false,
});

async function importExistingMedia() {
  console.log('========================================');
  console.log('Import Existing Media Files');
  console.log('========================================\n');

  try {
    // Initialize database connection
    console.log('1. Connecting to database...');
    await AppDataSource.initialize();
    console.log('   ✓ Connected\n');

    const mediaRepository = AppDataSource.getRepository(MediaFile);

    // Source directories
    const imageSource = path.join(process.cwd(), '..', 'images');
    const videoSource = path.join(process.cwd(), '..', 'video');

    // Destination directories
    const imageDest = path.join(process.cwd(), '..', 'frontend', 'public', 'images');
    const videoDest = path.join(process.cwd(), '..', 'frontend', 'public', 'video');

    // Ensure destination directories exist
    if (!fs.existsSync(imageDest)) {
      fs.mkdirSync(imageDest, { recursive: true });
    }
    if (!fs.existsSync(videoDest)) {
      fs.mkdirSync(videoDest, { recursive: true });
    }

    let totalCopied = 0;
    let totalAdded = 0;

    // Process images
    console.log('2. Processing images...');
    if (fs.existsSync(imageSource)) {
      const imageFiles = fs.readdirSync(imageSource).filter(f => 
        f.toLowerCase().endsWith('.jpeg') || 
        f.toLowerCase().endsWith('.jpg') || 
        f.toLowerCase().endsWith('.png')
      );

      for (const filename of imageFiles) {
        const sourcePath = path.join(imageSource, filename);
        const destPath = path.join(imageDest, filename);

        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        totalCopied++;

        // Get file stats
        const stats = fs.statSync(destPath);

        // Check if already exists in database
        const existing = await mediaRepository.findOne({
          where: { publicId: filename }
        });

        if (!existing) {
          // Add to database
          const mediaFile = mediaRepository.create({
            name: filename,
            url: `/images/${filename}`,
            publicId: filename,
            type: MediaType.IMAGE,
            mimeType: filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
            size: stats.size,
            folder: 'treatments',
          });

          await mediaRepository.save(mediaFile);
          console.log(`   ✓ Added: ${filename}`);
          totalAdded++;
        } else {
          console.log(`   - Skipped (exists): ${filename}`);
        }
      }
    }

    // Process videos
    console.log('\n3. Processing videos...');
    if (fs.existsSync(videoSource)) {
      const videoFiles = fs.readdirSync(videoSource).filter(f => 
        f.toLowerCase().endsWith('.mp4') || 
        f.toLowerCase().endsWith('.mov') || 
        f.toLowerCase().endsWith('.avi')
      );

      for (const filename of videoFiles) {
        const sourcePath = path.join(videoSource, filename);
        const destPath = path.join(videoDest, filename);

        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        totalCopied++;

        // Get file stats
        const stats = fs.statSync(destPath);

        // Check if already exists in database
        const existing = await mediaRepository.findOne({
          where: { publicId: filename }
        });

        if (!existing) {
          // Add to database
          const mediaFile = mediaRepository.create({
            name: filename,
            url: `/video/${filename}`,
            publicId: filename,
            type: MediaType.VIDEO,
            mimeType: 'video/mp4',
            size: stats.size,
            folder: 'treatments',
          });

          await mediaRepository.save(mediaFile);
          console.log(`   ✓ Added: ${filename}`);
          totalAdded++;
        } else {
          console.log(`   - Skipped (exists): ${filename}`);
        }
      }
    }

    // Summary
    console.log('\n========================================');
    console.log('Summary');
    console.log('========================================');
    console.log(`Files copied: ${totalCopied}`);
    console.log(`Files added to database: ${totalAdded}`);
    console.log('\n✓ Import complete!');
    console.log('\nView gallery at: http://localhost:3000/gallery\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error importing media:', error);
    process.exit(1);
  }
}

// Run the import
importExistingMedia();
