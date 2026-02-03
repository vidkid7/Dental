"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path = require("path");
(0, dotenv_1.config)({ path: path.join(__dirname, '../.env') });
async function checkDatabase() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'dental_user',
        password: process.env.DATABASE_PASSWORD || 'dental_password',
        database: process.env.DATABASE_NAME || 'dental_db',
    });
    try {
        await dataSource.initialize();
        const result = await dataSource.query('SELECT 1 as ok');
        await dataSource.destroy();
        console.log('✅ Database connected and working');
        console.log('   Host:', process.env.DATABASE_HOST || 'localhost');
        console.log('   Database:', process.env.DATABASE_NAME || 'dental_db');
        console.log('   Ping result:', result);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error);
        process.exit(1);
    }
}
checkDatabase();
//# sourceMappingURL=check-database.js.map