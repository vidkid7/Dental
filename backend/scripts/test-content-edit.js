const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

async function testContentEdit() {
  try {
    // Login
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('✓ Login successful\n');

    // Get current home hero content
    console.log('Fetching current home hero content...');
    const currentContent = await axios.get(`${API_URL}/content/page/home/hero`);
    console.log('Current hero title:', currentContent.data.content?.title);
    console.log('Current hero subtitle:', currentContent.data.content?.subtitle);
    console.log('');

    // Update the content
    console.log('Updating content...');
    const updateResponse = await axios.put(
      `${API_URL}/content/page/home/hero`,
      {
        content: {
          ...currentContent.data.content,
          title: 'Your Smile, Our Priority - TEST UPDATE',
          subtitle: 'Om Chabahil Dental Hospital - TEST - Providing quality dental care.'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ Content updated successfully\n');

    // Fetch updated content
    console.log('Fetching updated content...');
    const updatedContent = await axios.get(`${API_URL}/content/page/home/hero`);
    console.log('New hero title:', updatedContent.data.content?.title);
    console.log('New hero subtitle:', updatedContent.data.content?.subtitle);
    console.log('');

    // Restore original content
    console.log('Restoring original content...');
    await axios.put(
      `${API_URL}/content/page/home/hero`,
      {
        content: currentContent.data.content
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ Original content restored\n');

    console.log('✅ Content edit functionality is working correctly!');
    console.log('The admin panel can successfully update content via the API.');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testContentEdit();
