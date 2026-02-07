const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

async function updateSettings() {
  try {
    // Login
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('✓ Login successful\n');

    // Update settings
    console.log('Updating settings...');
    const settings = [
      { key: 'siteName', value: 'Om Chabahil Dental Hospital', category: 'general' },
      { key: 'tagline', value: 'Your Smile, Our Priority', category: 'general' },
      { key: 'phone', value: '+977 9841-234567', category: 'contact' },
      { key: 'whatsapp', value: '+977 9841234567', category: 'contact' },
      { key: 'email', value: 'info@omchabahildental.com.np', category: 'contact' },
      { key: 'address', value: 'Chabahil, Koteshwor, Kathmandu, Nepal', category: 'contact' },
      { key: 'weekdayHours', value: 'Sunday - Friday: 9:00 AM - 6:00 PM', category: 'hours' },
      { key: 'saturdayHours', value: 'Saturday: 9:00 AM - 4:00 PM', category: 'hours' },
    ];

    await axios.post(
      `${API_URL}/settings/bulk`,
      { settings },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ Settings updated\n');

    // Verify
    console.log('Verifying settings...');
    const verifyResponse = await axios.get(`${API_URL}/settings/object`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('Phone:', verifyResponse.data.phone);
    console.log('Address:', verifyResponse.data.address);
    console.log('');

    console.log('✅ Settings updated successfully!');
    console.log('');
    console.log('📋 You can now edit these from the admin panel:');
    console.log('   Go to http://localhost:3002/admin/settings');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateSettings();
