const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

async function restoreHeroContent() {
  try {
    // Login
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('✓ Login successful\n');

    // Restore original hero content
    console.log('Restoring original hero content...');
    await axios.put(
      `${API_URL}/content/page/home/hero`,
      {
        content: {
          badgeText: 'Open 7 Days a Week - Quality Dental Care',
          title: 'Your Smile,',
          highlightText: 'Our Priority',
          subtitle: 'Om Chabahil Dental Hospital - Providing quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
          primaryCtaText: 'Book Appointment',
          secondaryCtaText: 'Call Now',
          stats: {
            yearsExperience: '10+',
            expertDentists: '15+',
            happyPatients: '5000+'
          }
        },
        seo: {
          title: 'Om Chabahil Dental Hospital | Quality Dental Care in Kathmandu',
          description: 'Om Chabahil Dental Hospital provides quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
          keywords: ['dental hospital', 'Om Chabahil Dental', 'dentist Kathmandu']
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ Original content restored\n');

    // Verify
    console.log('Verifying...');
    const verifyContent = await axios.get(`${API_URL}/content/page/home/hero`);
    console.log('Current title:', verifyContent.data.content?.title, verifyContent.data.content?.highlightText);
    console.log('Current subtitle:', verifyContent.data.content?.subtitle?.substring(0, 60) + '...');
    console.log('');

    console.log('✅ Hero content restored to original values!');
    console.log('');
    console.log('📋 Content now shows:');
    console.log('   Title: "Your Smile, Our Priority"');
    console.log('   Subtitle: "Om Chabahil Dental Hospital - Providing quality dental care..."');
    console.log('   Stats: 10+ Years, 15+ Dentists, 5000+ Patients');
    console.log('');
    console.log('🌐 Refresh http://localhost:3002 to see the restored content!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

restoreHeroContent();
