const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

async function verifyAllData() {
  let accessToken;
  
  try {
    console.log('🔍 COMPREHENSIVE DATA VERIFICATION\n');
    console.log('=' .repeat(60));
    
    // 1. Login
    console.log('\n1️⃣  AUTHENTICATION');
    console.log('-'.repeat(60));
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD
      });
      accessToken = loginResponse.data.accessToken;
      console.log('✅ Login successful');
      console.log(`   User: ${loginResponse.data.user.email}`);
      console.log(`   Role: ${loginResponse.data.user.role}`);
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      return;
    }

    // 2. Settings
    console.log('\n2️⃣  SETTINGS');
    console.log('-'.repeat(60));
    try {
      const settingsResponse = await axios.get(`${API_URL}/settings/object`);
      const settings = settingsResponse.data;
      console.log('✅ Settings loaded');
      console.log(`   Site Name: ${settings.siteName || 'NOT SET'}`);
      console.log(`   Phone: ${settings.phone || 'NOT SET'}`);
      console.log(`   Email: ${settings.email || 'NOT SET'}`);
      console.log(`   Address: ${settings.address || 'NOT SET'}`);
      console.log(`   Total Settings: ${Object.keys(settings).length}`);
    } catch (error) {
      console.log('❌ Settings failed:', error.response?.data?.message || error.message);
    }

    // 3. Doctors
    console.log('\n3️⃣  DOCTORS');
    console.log('-'.repeat(60));
    try {
      const doctorsResponse = await axios.get(`${API_URL}/doctors`);
      const doctors = doctorsResponse.data.data || doctorsResponse.data;
      const total = doctorsResponse.data.total || doctors.length;
      console.log(`✅ Doctors loaded: ${total} doctors`);
      doctors.slice(0, 3).forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.name} - ${doc.specialization}`);
      });
      if (doctors.length > 3) {
        console.log(`   ... and ${doctors.length - 3} more`);
      }
    } catch (error) {
      console.log('❌ Doctors failed:', error.response?.data?.message || error.message);
    }

    // 4. Services
    console.log('\n4️⃣  SERVICES');
    console.log('-'.repeat(60));
    try {
      const servicesResponse = await axios.get(`${API_URL}/services`);
      const services = servicesResponse.data.data || servicesResponse.data;
      const total = servicesResponse.data.total || services.length;
      console.log(`✅ Services loaded: ${total} services`);
      services.slice(0, 3).forEach((svc, i) => {
        console.log(`   ${i + 1}. ${svc.name} - ${svc.department?.name || svc.department}`);
      });
      if (services.length > 3) {
        console.log(`   ... and ${services.length - 3} more`);
      }
    } catch (error) {
      console.log('❌ Services failed:', error.response?.data?.message || error.message);
    }

    // 5. Departments
    console.log('\n5️⃣  DEPARTMENTS');
    console.log('-'.repeat(60));
    try {
      const deptsResponse = await axios.get(`${API_URL}/departments`);
      const departments = deptsResponse.data.data || deptsResponse.data;
      const total = deptsResponse.data.total || departments.length;
      console.log(`✅ Departments loaded: ${total} departments`);
      departments.slice(0, 5).forEach((dept, i) => {
        console.log(`   ${i + 1}. ${dept.name}`);
      });
      if (departments.length > 5) {
        console.log(`   ... and ${departments.length - 5} more`);
      }
    } catch (error) {
      console.log('❌ Departments failed:', error.response?.data?.message || error.message);
    }

    // 6. Testimonials
    console.log('\n6️⃣  TESTIMONIALS');
    console.log('-'.repeat(60));
    try {
      const testimonialsResponse = await axios.get(`${API_URL}/testimonials`);
      const testimonials = testimonialsResponse.data.data || testimonialsResponse.data;
      const total = testimonialsResponse.data.total || testimonials.length;
      console.log(`✅ Testimonials loaded: ${total} testimonials`);
      testimonials.slice(0, 3).forEach((test, i) => {
        console.log(`   ${i + 1}. ${test.name} - ${test.role}`);
      });
      if (testimonials.length > 3) {
        console.log(`   ... and ${testimonials.length - 3} more`);
      }
    } catch (error) {
      console.log('❌ Testimonials failed:', error.response?.data?.message || error.message);
    }

    // 7. Page Content
    console.log('\n7️⃣  PAGE CONTENT');
    console.log('-'.repeat(60));
    try {
      const pagesResponse = await axios.get(`${API_URL}/content/pages`);
      const pages = pagesResponse.data;
      console.log(`✅ Page content loaded: ${pages.length} pages`);
      pages.slice(0, 5).forEach((page, i) => {
        console.log(`   ${i + 1}. ${page}`);
      });
      if (pages.length > 5) {
        console.log(`   ... and ${pages.length - 5} more pages`);
      }
    } catch (error) {
      console.log('❌ Page content failed:', error.response?.data?.message || error.message);
    }

    // 8. Blog Posts
    console.log('\n8️⃣  BLOG POSTS');
    console.log('-'.repeat(60));
    try {
      const blogsResponse = await axios.get(`${API_URL}/blog`);
      const blogs = blogsResponse.data.data || blogsResponse.data;
      const total = blogsResponse.data.total || blogs.length;
      console.log(`✅ Blog posts loaded: ${total} posts`);
      blogs.slice(0, 3).forEach((blog, i) => {
        console.log(`   ${i + 1}. ${blog.title}`);
      });
      if (blogs.length > 3) {
        console.log(`   ... and ${blogs.length - 3} more`);
      }
    } catch (error) {
      console.log('❌ Blog posts failed:', error.response?.data?.message || error.message);
    }

    // 9. Appointments (with auth)
    console.log('\n9️⃣  APPOINTMENTS');
    console.log('-'.repeat(60));
    try {
      const appointmentsResponse = await axios.get(`${API_URL}/appointments`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const appointments = appointmentsResponse.data.data || appointmentsResponse.data;
      const total = appointmentsResponse.data.total || appointments.length;
      console.log(`✅ Appointments loaded: ${total} appointments`);
      
      // Count by status
      const statuses = {};
      appointments.forEach(apt => {
        if (!statuses[apt.status]) statuses[apt.status] = 0;
        statuses[apt.status]++;
      });
      
      Object.entries(statuses).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
    } catch (error) {
      console.log('❌ Appointments failed:', error.response?.data?.message || error.message);
    }

    // 10. Enquiries (with auth)
    console.log('\n🔟 ENQUIRIES');
    console.log('-'.repeat(60));
    try {
      const enquiriesResponse = await axios.get(`${API_URL}/enquiries`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const enquiries = enquiriesResponse.data.data || enquiriesResponse.data;
      const total = enquiriesResponse.data.total || enquiries.length;
      console.log(`✅ Enquiries loaded: ${total} enquiries`);
      
      // Count by status
      const statuses = {};
      enquiries.forEach(enq => {
        if (!statuses[enq.status]) statuses[enq.status] = 0;
        statuses[enq.status]++;
      });
      
      Object.entries(statuses).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
    } catch (error) {
      console.log('❌ Enquiries failed:', error.response?.data?.message || error.message);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICATION COMPLETE');
    console.log('='.repeat(60));
    console.log('\n📊 All admin panel data has been verified!');
    console.log('🌐 You can now access the admin panel at http://localhost:3002/admin');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
  }
}

verifyAllData();
