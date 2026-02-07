import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

async function seedDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'dental_user',
    password: process.env.DATABASE_PASSWORD || 'dental_password',
    database: process.env.DATABASE_NAME || 'dental_db',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Read and execute init.sql
    const initSqlPath = path.join(__dirname, '../database/init.sql');
    const sql = fs.readFileSync(initSqlPath, 'utf8');

    console.log('📝 Executing seed script...\n');

    // Remove comments and clean up SQL
    let cleanSql = sql
      .replace(/--.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .trim();

    // Split by semicolons that are followed by newline (end of statement)
    // But preserve JSONB content which may contain semicolons
    const statements: string[] = [];
    let currentStatement = '';
    let inString = false;
    let stringChar = '';
    let depth = 0; // Track parentheses depth for JSONB

    for (let i = 0; i < cleanSql.length; i++) {
      const char = cleanSql[i];
      const nextChar = cleanSql[i + 1];

      if ((char === "'" || char === '"') && cleanSql[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }

      if (!inString) {
        if (char === '(') depth++;
        if (char === ')') depth--;
      }

      currentStatement += char;

      // End of statement: semicolon followed by newline/whitespace, and we're not in a string or nested structure
      if (
        char === ';' &&
        !inString &&
        depth === 0 &&
        (nextChar === '\n' || nextChar === '\r' || i === cleanSql.length - 1)
      ) {
        const trimmed = currentStatement.trim();
        if (trimmed && !trimmed.match(/^(BEGIN|COMMIT|ROLLBACK)/i)) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }

    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    console.log(`   Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() && statement.length > 10) {
        try {
          await dataSource.query(statement);
          successCount++;
          if ((i + 1) % 20 === 0) {
            console.log(`   Processed ${i + 1}/${statements.length} statements...`);
          }
        } catch (error: any) {
          // Ignore expected errors (duplicates, conflicts)
          const errorMsg = error.message?.toLowerCase() || '';
          if (
            errorMsg.includes('duplicate') ||
            errorMsg.includes('already exists') ||
            errorMsg.includes('violates unique constraint') ||
            errorMsg.includes('conflict') ||
            errorMsg.includes('do nothing')
          ) {
            // Expected - data already exists
            successCount++;
          } else {
            errorCount++;
            if (errorCount <= 5) {
              // Only show first 5 errors
              console.warn(`⚠️  Error on statement ${i + 1}:`, error.message?.substring(0, 150));
            }
          }
        }
      }
    }

    console.log('\n✅ Database seeding completed!');
    console.log(`   ✅ Successful: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   ⚠️  Errors: ${errorCount}`);
    }
    console.log('\n📊 Seeded data:');
    console.log('   - Users, Departments, Academic Programs');
    console.log('   - Doctors (10), Services (11), Testimonials (6)');
    console.log('   - Blog Posts (3), Gallery Items (8)');
    console.log('   - Clinic Information');
    console.log('   - All Page Content (Home, About, Services, etc.)');
    console.log('   - Site Settings');
    console.log('\n🎉 You can now see all data in the admin panel!');
    console.log('   Refresh your admin panel to see the seeded data.\n');
  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database credentials in .env are correct');
    console.error('   3. Database "dental_db" exists');
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seedDatabase();
