const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const LOGIN_EMAIL = 'admin@dental.com';
const LOGIN_PASSWORD = 'Admin@123';

const blogUpdates = [
  {
    slug: '10-essential-tips-for-oral-health',
    featuredImage: '/images/blog-1.jpg',
    title: '10 Essential Tips for Maintaining Oral Health',
    description: 'Dental hygiene and oral health tips'
  },
  {
    slug: 'understanding-bds-program',
    featuredImage: '/images/blog-2.jpg',
    title: 'Understanding the BDS Program: A Complete Guide',
    description: 'Dental education and BDS program'
  },
  {
    slug: 'modern-orthodontics-beyond-braces',
    featuredImage: '/images/blog-3.jpg',
    title: 'Modern Orthodontics: Beyond Traditional Braces',
    description: 'Orthodontic braces and teeth alignment'
  }
];

async function seedBlogImages() {
  try {
    console.log('📸 BLOG IMAGES SEEDING\n');
    console.log('=' .repeat(60));
    
    // 1. Login
    console.log('\n1️⃣  Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD
    });
    const accessToken = loginResponse.data.accessToken;
    console.log('   ✅ Login successful\n');

    // 2. Get all blog posts
    console.log('2️⃣  Fetching blog posts...');
    const blogsResponse = await axios.get(`${API_URL}/blog`);
    const blogs = blogsResponse.data.data || blogsResponse.data;
    console.log(`   ✅ Found ${blogs.length} blog posts\n`);

    // 3. Update each blog with featured image
    console.log('3️⃣  Updating blog images...');
    for (const update of blogUpdates) {
      const blog = blogs.find(b => b.slug === update.slug);
      
      if (!blog) {
        console.log(`   ⚠️  Blog not found: ${update.slug}`);
        continue;
      }

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
        console.log(`   ✅ Updated: ${update.title}`);
        console.log(`      Image: ${update.featuredImage}`);
      } catch (error) {
        console.log(`   ❌ Failed to update ${update.slug}:`, error.response?.data?.message || error.message);
      }
    }

    // 4. Verify updates
    console.log('\n4️⃣  Verifying updates...');
    const verifyResponse = await axios.get(`${API_URL}/blog`);
    const updatedBlogs = verifyResponse.data.data || verifyResponse.data;
    
    console.log('');
    updatedBlogs.forEach((blog, i) => {
      console.log(`   ${i + 1}. ${blog.title}`);
      console.log(`      Image: ${blog.featuredImage || 'NOT SET'}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ BLOG IMAGES SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 All blog posts now have featured images!');
    console.log('🌐 Refresh http://localhost:3002/blog to see the images!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

seedBlogImages();
