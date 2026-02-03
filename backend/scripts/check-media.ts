import { DataSource } from 'typeorm';
import { MediaFile } from '../src/modules/media/entities/media.entity';

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

async function checkMedia() {
  try {
    await AppDataSource.initialize();
    const mediaRepository = AppDataSource.getRepository(MediaFile);

    const allMedia = await mediaRepository.find({
      order: { createdAt: 'DESC' }
    });

    console.log('\n========================================');
    console.log('Media Files in Database');
    console.log('========================================\n');
    console.log(`Total files: ${allMedia.length}\n`);

    const images = allMedia.filter(m => m.type === 'image');
    const videos = allMedia.filter(m => m.type === 'video');

    console.log(`Images: ${images.length}`);
    console.log(`Videos: ${videos.length}\n`);

    console.log('Files by folder:');
    const folders = new Map<string, number>();
    allMedia.forEach(m => {
      const folder = m.folder || 'no-folder';
      folders.set(folder, (folders.get(folder) || 0) + 1);
    });
    folders.forEach((count, folder) => {
      console.log(`  ${folder}: ${count} files`);
    });

    console.log('\n========================================');
    console.log('All Files:');
    console.log('========================================\n');
    
    allMedia.forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}`);
      console.log(`   Type: ${m.type}`);
      console.log(`   Folder: ${m.folder || 'none'}`);
      console.log(`   URL: ${m.url}`);
      console.log('');
    });

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMedia();
