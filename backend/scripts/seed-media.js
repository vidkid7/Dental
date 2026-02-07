const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

// Define media files to seed (files that already exist in frontend/public)
const mediaFiles = [
  // Blog Images
  {
    name: 'Blog Post 1 - Oral Health Tips',
    url: '/images/blog-1.jpg',
    publicId: 'blog-1.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'blog',
    alt: 'Dental hygiene and oral health care tips',
    caption: '10 Essential Tips for Maintaining Oral Health'
  },
  {
    name: 'Blog Post 2 - BDS Program',
    url: '/images/blog-2.jpg',
    publicId: 'blog-2.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'blog',
    alt: 'Dental education and BDS program guide',
    caption: 'Understanding the BDS Program: A Complete Guide'
  },
  {
    name: 'Blog Post 3 - Modern Orthodontics',
    url: '/images/blog-3.jpg',
    publicId: 'blog-3.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'blog',
    alt: 'Modern orthodontic treatment options and braces',
    caption: 'Modern Orthodontics: Beyond Traditional Braces'
  },
  
  // Clinic Images
  {
    name: 'Clinic Photo 1',
    url: '/images/clinic-1.jpg',
    publicId: 'clinic-1.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'clinic',
    alt: 'Modern dental clinic treatment room',
    caption: 'State-of-the-art dental treatment facility'
  },
  {
    name: 'Clinic Photo 2',
    url: '/images/clinic-2.jpg',
    publicId: 'clinic-2.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'clinic',
    alt: 'Dental clinic reception and waiting area',
    caption: 'Welcoming reception area'
  },
  {
    name: 'Clinic Photo 3',
    url: '/images/clinic-3.jpg',
    publicId: 'clinic-3.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'clinic',
    alt: 'Advanced dental equipment and technology',
    caption: 'Modern dental equipment'
  },
  {
    name: 'Clinic Photo 4',
    url: '/images/clinic-4.jpg',
    publicId: 'clinic-4.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'clinic',
    alt: 'Dental treatment procedure in progress',
    caption: 'Professional dental care'
  },
  {
    name: 'Clinic Photo 5',
    url: '/images/clinic-5.jpg',
    publicId: 'clinic-5.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'clinic',
    alt: 'Clean and modern clinic interior',
    caption: 'Modern clinic environment'
  },
  
  // Team Photo
  {
    name: 'Dental Team Photo',
    url: '/images/team.jpg',
    publicId: 'team.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'general',
    alt: 'Om Chabahil Dental Hospital team',
    caption: 'Our dedicated dental team'
  },
  
  // Logo
  {
    name: 'Hospital Logo',
    url: '/images/logo.jpg',
    publicId: 'logo.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    folder: 'general',
    alt: 'Om Chabahil Dental Hospital logo',
    caption: 'Hospital logo'
  }
];

async function seedMedia() {
  try {
    console.log('📁 MEDIA FILES SEEDING\n');
    console.log('=' .repeat(60));
    
    // 1. Login
    console.log('\n1️⃣  Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('   ✅ Login successful\n');

    // 2. Check which files exist
    console.log('2️⃣  Checking files...');
    const publicPath = path.join(__dirname, '../../frontend/public');
    const existingFiles = [];
    const missingFiles = [];
    
    for (const media of mediaFiles) {
      const filePath = path.join(publicPath, media.url);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        media.size = stats.size;
        existingFiles.push(media);
        console.log(`   ✅ Found: ${media.url} (${(stats.size / 1024).toFixed(1)} KB)`);
      } else {
        missingFiles.push(media);
        console.log(`   ⚠️  Missing: ${media.url}`);
      }
    }
    
    console.log(`\n   Total: ${existingFiles.length} found, ${missingFiles.length} missing\n`);

    if (existingFiles.length === 0) {
      console.log('❌ No files found to seed!');
      return;
    }

    // 3. Seed media records via direct database insert
    console.log('3️⃣  Seeding media records...');
    console.log('   Note: Media records should be added to init.sql for proper seeding\n');
    
    // Display SQL for manual insertion
    console.log('   SQL to add to init.sql:\n');
    console.log('   ```sql');
    console.log('   INSERT INTO media_files (');
    console.log('     id, name, url, public_id, type, mime_type,');
    console.log('     size, folder, alt, caption, created_at, updated_at');
    console.log('   ) VALUES');
    
    existingFiles.forEach((media, index) => {
      const isLast = index === existingFiles.length - 1;
      console.log(`   (
     uuid_generate_v4(),
     '${media.name}',
     '${media.url}',
     '${media.publicId}',
     '${media.type}',
     '${media.mimeType}',
     ${media.size},
     '${media.folder}',
     '${media.alt}',
     '${media.caption}',
     NOW(),
     NOW()
   )${isLast ? ';' : ','}`);
    });
    
    console.log('   ```\n');

    // 4. Summary
    console.log('=' .repeat(60));
    console.log('📊 SUMMARY');
    console.log('=' .repeat(60));
    console.log(`\n✅ Files found: ${existingFiles.length}`);
    console.log(`⚠️  Files missing: ${missingFiles.length}`);
    
    if (missingFiles.length > 0) {
      console.log('\n⚠️  Missing files:');
      missingFiles.forEach(media => {
        console.log(`   - ${media.url}`);
      });
    }
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Copy the SQL above');
    console.log('   2. Add it to backend/database/init.sql');
    console.log('   3. Run: npm run db:reset (in backend folder)');
    console.log('   4. Media files will be tracked in database');
    
    console.log('\n💡 Alternative: Use admin panel to upload files');
    console.log('   - Go to http://localhost:3002/admin/media');
    console.log('   - Upload files through the interface');
    console.log('   - Files will be automatically tracked\n');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

seedMedia();
