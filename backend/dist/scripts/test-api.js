"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const API_URL = 'http://localhost:4000/api/v1';
async function testAPI() {
    try {
        console.log('🧪 Testing API endpoints...\n');
        console.log('1. Testing /doctors endpoint...');
        const doctorsResponse = await axios_1.default.get(`${API_URL}/doctors`, {
            params: { page: 1, limit: 100 },
        });
        console.log(`   ✅ Doctors: ${doctorsResponse.data.data?.length || 0} found`);
        console.log(`   Response structure:`, {
            hasData: !!doctorsResponse.data.data,
            total: doctorsResponse.data.total,
            page: doctorsResponse.data.page,
        });
        console.log('\n2. Testing /services endpoint...');
        const servicesResponse = await axios_1.default.get(`${API_URL}/services`);
        console.log(`   ✅ Services: ${servicesResponse.data?.length || 0} found`);
        console.log('\n3. Testing /blog endpoint...');
        const blogResponse = await axios_1.default.get(`${API_URL}/blog`, {
            params: { page: 1, limit: 10 },
        });
        console.log(`   ✅ Blog posts: ${blogResponse.data.data?.length || 0} found`);
        console.log('\n4. Testing /testimonials endpoint...');
        const testimonialsResponse = await axios_1.default.get(`${API_URL}/testimonials`);
        console.log(`   ✅ Testimonials: ${testimonialsResponse.data?.length || 0} found`);
        console.log('\n✅ All API endpoints are working!');
    }
    catch (error) {
        console.error('❌ API Test Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        process.exit(1);
    }
}
testAPI();
//# sourceMappingURL=test-api.js.map