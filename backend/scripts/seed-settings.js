const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

const settings = [
  { key: 'siteName', value: 'Om Chabahil Dental Hospital', category: 'general' },
  { key: 'tagline', value: 'Your Smile, Our Priority', category: 'general' },
  { key: 'siteDescription', value: 'Premier dental care in Kathmandu with state-of-the-art technology and experienced doctors.', category: 'general' },
  { key: 'phone', value: '+977 9841-234567', category: 'contact' },
  { key: 'whatsapp', value: '+977 9841234567', category: 'contact' },
  { key: 'email', value: 'info@omchabahildental.com.np', category: 'contact' },
  { key: 'address', value: 'Chabahil, Koteshwor, Kathmandu, Nepal', category: 'contact' },
  { key: 'weekdayHours', value: 'Sunday - Friday: 9:00 AM - 6:00 PM', category: 'hours' },
  { key: 'saturdayHours', value: 'Saturday: 9:00 AM - 4:00 PM', category: 'hours' },
  { key: 'facebook', value: 'https://facebook.com/omchabahildental', category: 'social' },
  { key: 'instagram', value: 'https://instagram.com/omchabahildental', category: 'social' },
  { key: 'twitter', value: 'https://twitter.com/omchabahildental', category: 'social' },
  { key: 'metaTitle', value: 'Om Chabahil Dental Hospital | Quality Dental Care in Kathmandu', category: 'seo' },
  { key: 'metaDescription', value: 'Om Chabahil Dental Hospital provides quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.', category: 'seo' },
  { key: 'metaKeywords', value: 'dental hospital, dentist kathmandu, dental clinic, teeth treatment, Om Chabahil Dental', category: 'seo' },
];

async function seedSettings() {
  try {
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('   ✓ Login successful\n');

    console.log('2. Seeding settings...');
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
    console.log('   ✓ Settings seeded\n');

    console.log('3. Verifying settings...');
    const verifyResponse = await axios.get(`${API_URL}/settings/object`);
    console.log('   Phone:', verifyResponse.data.phone);
    console.log('   Email:', verifyResponse.data.email);
    console.log('   Address:', verifyResponse.data.address);
    console.log('');

    console.log('✅ Settings seeded successfully!');
    console.log('');
    console.log('🌐 Refresh http://localhost:3002 to see settings in Header/Footer!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

seedSettings();
