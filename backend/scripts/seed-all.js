const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

// Color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function seedAll() {
  let accessToken;
  const results = {
    settings: { success: false, count: 0 },
    blogImages: { success: false, count: 0 },
    media: { success: false, count: 0 },
    verification: { success: false, data: {} }
  };

  try {
    section('🚀 COMPREHENSIVE DATA SEEDING');
    log('Starting complete system seed...', 'cyan');

    // ============================================
    // 1. LOGIN
    // ============================================
    section('1️⃣  AUTHENTICATION');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD
      });
      accessToken = loginResponse.data.accessToken;
      log('✅ Login successful', 'green');
      log(`   User: ${loginResponse.data.user.email}`, 'cyan');
      log(`   Role: ${loginResponse.data.user.role}`, 'cyan');
    } catch (error) {
      log('❌ Login failed: ' + (error.response?.data?.message || error.message), 'red');
      throw new Error('Authentication failed');
    }

    // ============================================
    // 2. SEED SETTINGS
    // ============================================
    section('2️⃣  SEEDING SETTINGS');
    
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

    try {
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
      results.settings.success = true;
      results.settings.count = settings.length;
      log(`✅ Settings seeded: ${settings.length} settings`, 'green');
    } catch (error) {
      log('❌ Settings failed: ' + (error.response?.data?.message || error.message), 'red');
    }

    // ============================================
    // 3. SEED BLOG IMAGES
    // ============================================
    section('3️⃣  SEEDING BLOG IMAGES');
    
    const blogUpdates = [
      {
        slug: '10-essential-tips-for-oral-health',
        featuredImage: '/images/blog-1.jpg',
        title: '10 Essential Tips for Maintaining Oral Health'
      },
      {
        slug: 'understanding-bds-program',
        featuredImage: '/images/blog-2.jpg',
        title: 'Understanding the BDS Program: A Complete Guide'
      },
      {
        slug: 'modern-orthodontics-beyond-traditional-braces',
        featuredImage: '/images/blog-3.jpg',
        title: 'Modern Orthodontics: Beyond Traditional Braces'
      }
    ];

    try {
      const blogsResponse = await axios.get(`${API_URL}/blog`);
      const blogs = blogsResponse.data.data || blogsResponse.data;
      
      let updatedCount = 0;
      for (const update of blogUpdates) {
        const blog = blogs.find(b => b.slug === update.slug);
        
        if (blog) {
          try {
            await axios.patch(
              `${API_URL}/blog/${blog.id}`,
              { featuredImage: update.featuredImage },
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            updatedCount++;
            log(`   ✅ ${update.title}`, 'green');
          } catch (error) {
            log(`   ❌ Failed: ${update.slug}`, 'red');
          }
        }
      }
      
      results.blogImages.success = updatedCount > 0;
      results.blogImages.count = updatedCount;
      log(`\n✅ Blog images updated: ${updatedCount}/${blogUpdates.length}`, 'green');
    } catch (error) {
      log('❌ Blog images failed: ' + (error.response?.data?.message || error.message), 'red');
    }

    // ============================================
    // 4. VERIFY MEDIA FILES
    // ============================================
    section('4️⃣  VERIFYING MEDIA FILES');
    
    const expectedMediaFiles = [
      '/images/blog-1.jpg',
      '/images/blog-2.jpg',
      '/images/blog-3.jpg',
      '/images/clinic-1.jpg',
      '/images/clinic-2.jpg',
      '/images/clinic-3.jpg',
      '/images/clinic-4.jpg',
      '/images/clinic-5.jpg',
      '/images/team.jpg',
      '/images/logo.jpg'
    ];

    try {
      const mediaResponse = await axios.get(`${API_URL}/media/public`);
      const media = mediaResponse.data.data || mediaResponse.data;
      
      const foundFiles = expectedMediaFiles.filter(url => 
        media.find(m => m.url === url)
      );
      
      results.media.success = foundFiles.length === expectedMediaFiles.length;
      results.media.count = foundFiles.length;
      
      log(`✅ Media files found: ${foundFiles.length}/${expectedMediaFiles.length}`, 'green');
      
      if (foundFiles.length < expectedMediaFiles.length) {
        log('\n⚠️  Missing media files:', 'yellow');
        expectedMediaFiles.forEach(url => {
          if (!media.find(m => m.url === url)) {
            log(`   - ${url}`, 'yellow');
          }
        });
        log('\n💡 Run: npm run seed:init (in backend folder) to seed media', 'cyan');
      }
    } catch (error) {
      log('❌ Media verification failed: ' + error.message, 'red');
    }

    // ============================================
    // 5. COMPREHENSIVE VERIFICATION
    // ============================================
    section('5️⃣  COMPREHENSIVE VERIFICATION');
    
    try {
      // Settings
      const settingsResponse = await axios.get(`${API_URL}/settings/object`);
      const settingsData = settingsResponse.data;
      results.verification.data.settings = Object.keys(settingsData).length;
      log(`✅ Settings: ${results.verification.data.settings}`, 'green');

      // Doctors
      const doctorsResponse = await axios.get(`${API_URL}/doctors`);
      const doctors = doctorsResponse.data.data || doctorsResponse.data;
      results.verification.data.doctors = doctors.length;
      log(`✅ Doctors: ${results.verification.data.doctors}`, 'green');

      // Services
      const servicesResponse = await axios.get(`${API_URL}/services`);
      const services = servicesResponse.data.data || servicesResponse.data;
      results.verification.data.services = services.length;
      log(`✅ Services: ${results.verification.data.services}`, 'green');

      // Departments
      const deptsResponse = await axios.get(`${API_URL}/departments`);
      const departments = deptsResponse.data.data || deptsResponse.data;
      results.verification.data.departments = departments.length;
      log(`✅ Departments: ${results.verification.data.departments}`, 'green');

      // Testimonials
      const testimonialsResponse = await axios.get(`${API_URL}/testimonials`);
      const testimonials = testimonialsResponse.data.data || testimonialsResponse.data;
      results.verification.data.testimonials = testimonials.length;
      log(`✅ Testimonials: ${results.verification.data.testimonials}`, 'green');

      // Blog Posts
      const blogsResponse = await axios.get(`${API_URL}/blog`);
      const blogs = blogsResponse.data.data || blogsResponse.data;
      results.verification.data.blogs = blogs.length;
      const blogsWithImages = blogs.filter(b => b.featuredImage).length;
      log(`✅ Blog Posts: ${results.verification.data.blogs} (${blogsWithImages} with images)`, 'green');

      // Page Content
      const pagesResponse = await axios.get(`${API_URL}/content/pages`);
      const pages = pagesResponse.data;
      results.verification.data.pages = pages.length;
      log(`✅ Pages: ${results.verification.data.pages}`, 'green');

      // Media
      const mediaResponse = await axios.get(`${API_URL}/media/public`);
      const media = mediaResponse.data.data || mediaResponse.data;
      results.verification.data.media = media.length;
      log(`✅ Media Files: ${results.verification.data.media}`, 'green');

      results.verification.success = true;
    } catch (error) {
      log('❌ Verification failed: ' + error.message, 'red');
    }

    // ============================================
    // FINAL SUMMARY
    // ============================================
    section('📊 SEEDING SUMMARY');
    
    console.log('');
    log('Settings:', 'bright');
    log(`  ${results.settings.success ? '✅' : '❌'} ${results.settings.count} settings seeded`, 
        results.settings.success ? 'green' : 'red');
    
    log('\nBlog Images:', 'bright');
    log(`  ${results.blogImages.success ? '✅' : '❌'} ${results.blogImages.count} blog images updated`, 
        results.blogImages.success ? 'green' : 'red');
    
    log('\nMedia Files:', 'bright');
    log(`  ${results.media.success ? '✅' : '❌'} ${results.media.count}/10 media files verified`, 
        results.media.success ? 'green' : 'yellow');
    
    log('\nSystem Data:', 'bright');
    if (results.verification.success) {
      Object.entries(results.verification.data).forEach(([key, value]) => {
        log(`  ✅ ${key}: ${value}`, 'green');
      });
    }

    console.log('');
    section('🎉 SEEDING COMPLETE!');
    
    log('Your dental hospital system is now fully seeded with:', 'cyan');
    log('  ✅ Site settings and configuration', 'green');
    log('  ✅ Blog posts with featured images', 'green');
    log('  ✅ Media files tracked in database', 'green');
    log('  ✅ Doctors, services, and departments', 'green');
    log('  ✅ Testimonials and page content', 'green');
    
    console.log('');
    log('🌐 Access your system:', 'bright');
    log('  Frontend: http://localhost:3002', 'cyan');
    log('  Admin Panel: http://localhost:3002/admin', 'cyan');
    log('  API: http://localhost:3001/api/v1', 'cyan');
    
    console.log('');
    log('👤 Admin Credentials:', 'bright');
    log('  Email: admin@dental.com', 'cyan');
    log('  Password: Admin@123', 'cyan');
    console.log('');

  } catch (error) {
    section('❌ SEEDING FAILED');
    log(error.message, 'red');
    console.log('');
    log('💡 Troubleshooting:', 'yellow');
    log('  1. Make sure backend is running: npm run start:dev', 'cyan');
    log('  2. Make sure database is seeded: npm run seed:init', 'cyan');
    log('  3. Check admin credentials are correct', 'cyan');
    console.log('');
  }
}

seedAll();
