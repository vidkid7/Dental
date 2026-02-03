"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function seedDatabase() {
    const dataSource = new typeorm_1.DataSource({
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
        const initSqlPath = path.join(__dirname, '../database/init.sql');
        const sql = fs.readFileSync(initSqlPath, 'utf8');
        console.log('📝 Executing seed script...\n');
        let cleanSql = sql
            .replace(/--.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .trim();
        const statements = [];
        let currentStatement = '';
        let inString = false;
        let stringChar = '';
        let depth = 0;
        for (let i = 0; i < cleanSql.length; i++) {
            const char = cleanSql[i];
            const nextChar = cleanSql[i + 1];
            if ((char === "'" || char === '"') && cleanSql[i - 1] !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                }
                else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            if (!inString) {
                if (char === '(')
                    depth++;
                if (char === ')')
                    depth--;
            }
            currentStatement += char;
            if (char === ';' &&
                !inString &&
                depth === 0 &&
                (nextChar === '\n' || nextChar === '\r' || i === cleanSql.length - 1)) {
                const trimmed = currentStatement.trim();
                if (trimmed && !trimmed.match(/^(BEGIN|COMMIT|ROLLBACK)/i)) {
                    statements.push(trimmed);
                }
                currentStatement = '';
            }
        }
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
                }
                catch (error) {
                    const errorMsg = error.message?.toLowerCase() || '';
                    if (errorMsg.includes('duplicate') ||
                        errorMsg.includes('already exists') ||
                        errorMsg.includes('violates unique constraint') ||
                        errorMsg.includes('conflict') ||
                        errorMsg.includes('do nothing')) {
                        successCount++;
                    }
                    else {
                        errorCount++;
                        if (errorCount <= 5) {
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
        console.log('   - Doctors (8), Services (8), Testimonials (6)');
        console.log('   - Blog Posts (3), Gallery Items (8)');
        console.log('   - Clinic Information');
        console.log('   - All Page Content (Home, About, Services, etc.)');
        console.log('   - Site Settings');
        console.log('\n🎉 You can now see all data in the admin panel!');
        console.log('   Refresh your admin panel to see the seeded data.\n');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error('\n💡 Make sure:');
        console.error('   1. PostgreSQL is running');
        console.error('   2. Database credentials in .env are correct');
        console.error('   3. Database "dental_db" exists');
        process.exit(1);
    }
    finally {
        await dataSource.destroy();
    }
}
seedDatabase();
//# sourceMappingURL=seed-database.js.map