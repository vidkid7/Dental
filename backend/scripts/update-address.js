const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

async function updateAddress() {
  try {
    // Login
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('✓ Login successful\n');

    // Update contact section address
    console.log('Updating contact section address...');
    const contactContent = await axios.get(`${API_URL}/content/page/home/contact`);
    await axios.put(
      `${API_URL}/content/page/home/contact`,
      {
        content: {
          ...contactContent.data.content,
          address: 'Chabahil, Koteshwor, Kathmandu, Nepal'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ Contact section updated\n');

    // Update CTA section address
    console.log('Updating CTA section address...');
    const ctaContent = await axios.get(`${API_URL}/content/page/home/cta`);
    if (ctaContent.data.content.contactCards) {
      await axios.put(
        `${API_URL}/content/page/home/cta`,
        {
          content: {
            ...ctaContent.data.content,
            contactCards: {
              ...ctaContent.data.content.contactCards,
              location: {
                label: 'Visit us at',
                value: 'Chabahil, Koteshwor, Kathmandu, Nepal'
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ CTA section updated\n');
    }

    // Update about section address
    console.log('Updating about section address...');
    const aboutContent = await axios.get(`${API_URL}/content/page/about/hero`);
    if (aboutContent.data.content) {
      await axios.put(
        `${API_URL}/content/page/about/hero`,
        {
          content: {
            ...aboutContent.data.content,
            address: 'Chabahil, Koteshwor, Kathmandu, Nepal'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ About section updated\n');
    }

    // Update contact page
    console.log('Updating contact page...');
    const contactPageContent = await axios.get(`${API_URL}/content/page/contact/contact`);
    if (contactPageContent.data.content && contactPageContent.data.content.contactInfo) {
      const updatedContactInfo = contactPageContent.data.content.contactInfo.map(info => {
        if (info.title === 'Visit Us') {
          return {
            ...info,
            lines: ['Chabahil, Koteshwor', 'Kathmandu, Nepal']
          };
        }
        return info;
      });

      await axios.put(
        `${API_URL}/content/page/contact/contact`,
        {
          content: {
            ...contactPageContent.data.content,
            contactInfo: updatedContactInfo
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ Contact page updated\n');
    }

    console.log('✅ All addresses updated successfully!');
    console.log('');
    console.log('📋 Updated to: "Chabahil, Koteshwor, Kathmandu, Nepal"');
    console.log('');
    console.log('🌐 Refresh http://localhost:3002 to see the updated address!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateAddress();
