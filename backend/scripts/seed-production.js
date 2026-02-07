#!/usr/bin/env node

/**
 * Production Seeding Script
 * 
 * Usage:
 *   API_URL=https://your-api.com ADMIN_EMAIL=admin@domain.com ADMIN_PASSWORD=pass node seed-production.js
 * 
 * Or with .env file:
 *   node seed-production.js
 */

require('dotenv').config();
const axios = require('axios');

// Configuration from environment variables
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dental.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

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

const blogUpdates = [
  {
    slug: '10-essential-tips-for-oral-health',
    featuredImage: '/images/blog-1.jpg',
  },
  {
    slug: 'understanding-bds-program',
    featuredImage: '/images/blog-2.jpg',
  },
  {
    slug: 'modern-orthodontics-beyond-traditional-braces',
    featuredImage: '/images/blog-3.jpg',
  }
];

async function seedProduction() {
  console.log('🚀 Production Seeding Script');
  console.log('=' .repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log(`Admin Email: ${ADMIN_EMAIL}`);
  console.log('=' .repeat(60));
  
  try {
    // 1. Test API connection
    console.log('\n📡 Testing API connection...');
    try {
      await axios.get(`${API_URL}/api/v1/settings/object`);
      console.log('✅ API is reachable');
    } catch (error) {
      console.error('❌ Cannot reach API. Make sure backend is running.');
      console.error(`   URL: ${API_URL}`);
      process.exit(1);
    }

    // 2. Login
    console.log('\n🔐 Authenticating...');
    let accessToken;
    try {
      const loginResponse = await axios.post(`${API_URL}/api/v1/auth/login`, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      });
      accessToken = loginResponse.data.accessToken;
      console.log('✅ Authentication successful');
    } catch (error) {
      console.error('❌ Authentication failed');
      console.error('   Make sure admin account exists and credentials are correct');
      console.error(`   Email: ${ADMIN_EMAIL}`);
      process.exit(1);
    }

    // 3. Seed settings
    console.log('\n⚙️  Seeding settings...');
    try {
      await axios.post(
        `${API_URL}/api/v1/settings/bulk`,
        { settings },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✅ Settings seeded: ${settings.length} items`);
    } catch (error) {
      console.error('❌ Settings seeding failed:', error.response?.data?.message || error.message);
    }

    // 4. Update blog images
    console.log('\n📸 Updating blog images...');
    try {
      const blogsResponse = await axios.get(`${API_URL}/api/v1/blog`);
      const blogs = blogsResponse.data.data || blogsResponse.data;
      
      let updatedCount = 0;
      for (const update of blogUpdates) {
        const blog = blogs.find(b => b.slug === update.slug);
        
        if (blog) {
          try {
            await axios.patch(
              `${API_URL}/api/v1/blog/${blog.id}`,
              { featuredImage: update.featuredImage },
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            updatedCount++;
          } catch (error) {
            console.error(`   ⚠️  Failed to update ${update.slug}`);
          }
        }
      }
      console.log(`✅ Blog images updated: ${updatedCount}/${blogUpdates.length}`);
    } catch (error) {
      console.error('❌ Blog images update failed:', error.message);
    }

    // 5. Verify data
    console.log('\n✅ Verifying seeded data...');
    try {
      const [settingsRes, doctorsRes, servicesRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/settings/object`),
        axios.get(`${API_URL}/api/v1/doctors`),
        axios.get(`${API_URL}/api/v1/services`),
        axios.get(`${API_URL}/api/v1/blog`)
      ]);

      const settingsCount = Object.keys(settingsRes.data).length;
      const doctorsCount = (doctorsRes.data.data || doctorsRes.data).length;
      const servicesCount = (servicesRes.data.data || servicesRes.data).length;
      const blogsCount = (blogsRes.data.data || blogsRes.data).length;

      console.log(`   Settings: ${settingsCount}`);
      console.log(`   Doctors: ${doctorsCount}`);
      console.log(`   Services: ${servicesCount}`);
      console.log(`   Blog Posts: ${blogsCount}`);
    } catch (error) {
      console.error('⚠️  Verification failed:', error.message);
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Production seeding completed successfully!');
    console.log('=' .repeat(60));
    console.log('\n✅ Your production system is now seeded with:');
    console.log('   - Site settings and configuration');
    console.log('   - Blog post images');
    console.log('   - All verified data');
    console.log('');

  } catch (error) {
    console.error('\n' + '=' .repeat(60));
    console.error('❌ Production seeding failed');
    console.error('=' .repeat(60));
    console.error('\nError:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure backend is running and accessible');
    console.error('   2. Verify database is seeded with: npm run seed:init');
    console.error('   3. Check environment variables are correct');
    console.error('   4. Ensure admin account exists in database');
    console.error('');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedProduction();
}

module.exports = seedProduction;
