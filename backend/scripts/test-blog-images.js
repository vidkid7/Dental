const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

async function testBlogImages() {
  try {
    console.log('🖼️  BLOG IMAGES TEST\n');
    console.log('=' .repeat(60));
    
    const response = await axios.get(`${API_URL}/blog`);
    const blogs = response.data.data || response.data;
    
    console.log(`\n✅ Found ${blogs.length} blog posts\n`);
    
    blogs.forEach((blog, i) => {
      console.log(`${i + 1}. ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Image: ${blog.featuredImage || '❌ NO IMAGE'}`);
      console.log(`   Author: ${blog.author}`);
      console.log(`   Category: ${blog.category}`);
      console.log(`   Published: ${blog.isPublished ? '✅ Yes' : '❌ No'}`);
      console.log('');
    });
    
    const withImages = blogs.filter(b => b.featuredImage).length;
    const withoutImages = blogs.filter(b => !b.featuredImage).length;
    
    console.log('=' .repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   Total Blogs: ${blogs.length}`);
    console.log(`   With Images: ${withImages} ✅`);
    console.log(`   Without Images: ${withoutImages} ${withoutImages > 0 ? '⚠️' : '✅'}`);
    console.log('=' .repeat(60));
    
    if (withoutImages === 0) {
      console.log('\n🎉 All blog posts have featured images!');
    } else {
      console.log('\n⚠️  Some blog posts are missing images.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBlogImages();
