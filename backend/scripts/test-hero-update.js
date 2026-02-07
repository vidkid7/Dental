const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

async function testHeroUpdate() {
  try {
    // Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('   ✓ Login successful\n');

    // Get current content
    console.log('2. Fetching current hero content...');
    const currentContent = await axios.get(`${API_URL}/content/page/home/hero`);
    console.log('   Current title:', currentContent.data.content?.title);
    console.log('   Current subtitle:', currentContent.data.content?.subtitle?.substring(0, 50) + '...');
    console.log('');

    // Update with test content
    console.log('3. Updating hero content with TEST values...');
    const testTitle = 'TEST TITLE - Your Smile Matters';
    const testSubtitle = 'TEST SUBTITLE - This is a test update from the admin panel to verify dynamic content works!';
    
    await axios.put(
      `${API_URL}/content/page/home/hero`,
      {
        content: {
          ...currentContent.data.content,
          title: testTitle,
          subtitle: testSubtitle,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('   ✓ Content updated\n');

    // Verify update
    console.log('4. Verifying update...');
    const updatedContent = await axios.get(`${API_URL}/content/page/home/hero`);
    console.log('   New title:', updatedContent.data.content?.title);
    console.log('   New subtitle:', updatedContent.data.content?.subtitle?.substring(0, 50) + '...');
    console.log('');

    console.log('✅ SUCCESS!');
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('   1. Open http://localhost:3002 in your browser');
    console.log('   2. Check the hero section (top of page)');
    console.log('   3. You should see:');
    console.log(`      - Title: "${testTitle}"`);
    console.log(`      - Subtitle: "${testSubtitle}"`);
    console.log('');
    console.log('   If you see the TEST values, the dynamic content is working! ✅');
    console.log('');
    console.log('💡 To restore original content, run this script again or edit via admin panel.');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testHeroUpdate();
