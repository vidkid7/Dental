const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

async function verifyMedia() {
  try {
    console.log('📁 MEDIA VERIFICATION\n');
    console.log('=' .repeat(60));
    
    // Get all media files
    const response = await axios.get(`${API_URL}/media/public`);
    const media = response.data.data || response.data;
    
    console.log(`\n✅ Total media files: ${media.length}\n`);
    
    // Group by folder
    const byFolder = {};
    media.forEach(item => {
      const folder = item.folder || 'no-folder';
      if (!byFolder[folder]) byFolder[folder] = [];
      byFolder[folder].push(item);
    });
    
    // Display by folder
    Object.entries(byFolder).forEach(([folder, items]) => {
      console.log(`📂 ${folder.toUpperCase()} (${items.length} files)`);
      items.forEach(item => {
        const size = (item.size / 1024).toFixed(1);
        console.log(`   - ${item.name}`);
        console.log(`     URL: ${item.url}`);
        console.log(`     Size: ${size} KB`);
        if (item.alt) console.log(`     Alt: ${item.alt}`);
      });
      console.log('');
    });
    
    // Check for our seeded files
    console.log('=' .repeat(60));
    console.log('🔍 CHECKING SEEDED FILES');
    console.log('=' .repeat(60));
    
    const expectedFiles = [
      '/images/blog-1.jpg',
      '/images/blog-2.jpg',
      '/images/blog-3.jpg',
      '/images/clinic-1.jpg',
      '/images/clinic-2.jpg',
      '/images/clinic-3.jpg',
      '/images/clinic-4.jpg',
      '/images/clinic-5.jpg',
      '/images/team.jpg',
      '/images/logo.jpg'
    ];
    
    console.log('');
    expectedFiles.forEach(url => {
      const found = media.find(m => m.url === url);
      if (found) {
        console.log(`✅ ${url}`);
      } else {
        console.log(`❌ ${url} - NOT FOUND`);
      }
    });
    
    const foundCount = expectedFiles.filter(url => 
      media.find(m => m.url === url)
    ).length;
    
    console.log('');
    console.log('=' .repeat(60));
    console.log(`📊 SUMMARY: ${foundCount}/${expectedFiles.length} seeded files found`);
    console.log('=' .repeat(60));
    
    if (foundCount === expectedFiles.length) {
      console.log('\n🎉 All media files are seeded!');
    } else {
      console.log(`\n⚠️  ${expectedFiles.length - foundCount} files missing. Run: npm run db:reset`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyMedia();
