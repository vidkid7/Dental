const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

// Login credentials
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

// Updated Nepali testimonials data (hospital, not college)
const testimonials = [
  {
    name: 'राम बहादुर श्रेष्ठ',
    role: 'दाँत उपचार बिरामी',
    content: 'ओम छबहिल डेन्टल अस्पतालमा मैले उत्कृष्ट सेवा पाएँ। डा. सुनिल श्रेष्ठले मेरो दाँतको समस्या धेरै राम्रोसँग समाधान गर्नुभयो। सबै कर्मचारीहरू धेरै मिलनसार र सहयोगी थिए।',
    rating: 5,
    isActive: true,
    order: 1
  },
  {
    name: 'सीता देवी तामाङ',
    role: 'रुट क्यानाल उपचार बिरामी',
    content: 'मलाई दाँतको धेरै पीडा थियो तर यहाँको उपचार पछि अहिले एकदम राम्रो छ। डा. प्रमिला राईको हातको काम एकदम राम्रो छ। धन्यवाद!',
    rating: 5,
    isActive: true,
    order: 2
  },
  {
    name: 'विष्णु प्रसाद पौडेल',
    role: 'दाँत सफा गर्ने बिरामी',
    content: 'यो अस्पतालको सफाइ र व्यवस्थापन एकदम राम्रो छ। डा. अनिल गुरुङले मेरो दाँत सफा गर्दा कुनै पीडा भएन। सबैलाई सिफारिस गर्छु।',
    rating: 5,
    isActive: true,
    order: 3
  },
  {
    name: 'लक्ष्मी कुमारी महर्जन',
    role: 'दाँत जडान बिरामी',
    content: 'मेरो छोरीको दाँत जडान गर्न आएको थिएँ। डा. सरिता लामिछानेले धेरै राम्रोसँग उपचार गर्नुभयो। बच्चाहरूसँग धेरै मायालु व्यवहार गर्नुहुन्छ।',
    rating: 5,
    isActive: true,
    order: 4
  },
  {
    name: 'कृष्ण बहादुर लामा',
    role: 'दाँत निकाल्ने बिरामी',
    content: 'डा. राजेश थापाले मेरो दाँत निकाल्दा एकदम सजिलो भयो। पहिले डर लागेको थियो तर यहाँको टोलीले धेरै राम्रो सेवा दिनुभयो।',
    rating: 5,
    isActive: true,
    order: 5
  },
  {
    name: 'गीता राई',
    role: 'दाँत सेतो बनाउने बिरामी',
    content: 'मेरो दाँत पहेँलो भएको थियो। यहाँ आएर दाँत सेतो बनाएपछि अहिले धेरै राम्रो देखिन्छ। डा. मनिषा खड्काको सेवा उत्कृष्ट थियो।',
    rating: 5,
    isActive: true,
    order: 6
  }
];

async function updateTestimonials() {
  try {
    // Login to get access token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });

    const accessToken = loginResponse.data.accessToken;
    console.log('Login successful!');

    // Get existing testimonials
    console.log('\nFetching existing testimonials...');
    const existingResponse = await axios.get(`${API_URL}/testimonials`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const existingTestimonials = existingResponse.data;
    console.log(`Found ${existingTestimonials.length} existing testimonials`);

    // Delete all existing testimonials
    console.log('\nDeleting old testimonials...');
    for (const testimonial of existingTestimonials) {
      await axios.delete(`${API_URL}/testimonials/${testimonial.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(`✓ Deleted: ${testimonial.name}`);
    }

    // Add new testimonials
    console.log('\nAdding updated testimonials...');
    for (const testimonial of testimonials) {
      const response = await axios.post(
        `${API_URL}/testimonials`,
        testimonial,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✓ Added: ${testimonial.name}`);
    }

    console.log('\n✅ All testimonials updated successfully!');
    console.log('Changed "कलेज" (college) to "अस्पताल" (hospital)');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

updateTestimonials();
