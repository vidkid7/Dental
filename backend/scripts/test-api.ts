import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test doctors endpoint
    console.log('1. Testing /doctors endpoint...');
    const doctorsResponse = await axios.get(`${API_URL}/doctors`, {
      params: { page: 1, limit: 100 },
    });
    console.log(`   ✅ Doctors: ${doctorsResponse.data.data?.length || 0} found`);
    console.log(`   Response structure:`, {
      hasData: !!doctorsResponse.data.data,
      total: doctorsResponse.data.total,
      page: doctorsResponse.data.page,
    });

    // Test services endpoint
    console.log('\n2. Testing /services endpoint...');
    const servicesResponse = await axios.get(`${API_URL}/services`);
    console.log(`   ✅ Services: ${servicesResponse.data?.length || 0} found`);

    // Test blog endpoint
    console.log('\n3. Testing /blog endpoint...');
    const blogResponse = await axios.get(`${API_URL}/blog`, {
      params: { page: 1, limit: 10 },
    });
    console.log(`   ✅ Blog posts: ${blogResponse.data.data?.length || 0} found`);

    // Test testimonials endpoint
    console.log('\n4. Testing /testimonials endpoint...');
    const testimonialsResponse = await axios.get(`${API_URL}/testimonials`);
    console.log(`   ✅ Testimonials: ${testimonialsResponse.data?.length || 0} found`);

    console.log('\n✅ All API endpoints are working!');
  } catch (error: any) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testAPI();
