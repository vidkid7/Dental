import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'dental_user',
  password: process.env.DATABASE_PASSWORD || 'dental_password',
  database: process.env.DATABASE_NAME || 'dental_db',
  synchronize: false,
  logging: false,
});

async function addDoctorAvailability() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to database');

    // Get all active doctors
    const doctors = await AppDataSource.query(
      'SELECT id, name FROM doctors WHERE is_active = true'
    );

    console.log(`📋 Found ${doctors.length} active doctors`);

    for (const doctor of doctors) {
      // Check if doctor already has availability
      const existingAvailability = await AppDataSource.query(
        'SELECT COUNT(*) as count FROM doctor_availabilities WHERE doctor_id = $1',
        [doctor.id]
      );

      if (parseInt(existingAvailability[0].count) > 0) {
        console.log(`⏭️  ${doctor.name} already has availability`);
        continue;
      }

      // Add availability for Monday to Friday (9 AM - 5 PM)
      // Saturday (9 AM - 4 PM)
      const availabilityData = [
        { dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' }, // Monday
        { dayOfWeek: 2, startTime: '09:00:00', endTime: '17:00:00' }, // Tuesday
        { dayOfWeek: 3, startTime: '09:00:00', endTime: '17:00:00' }, // Wednesday
        { dayOfWeek: 4, startTime: '09:00:00', endTime: '17:00:00' }, // Thursday
        { dayOfWeek: 5, startTime: '09:00:00', endTime: '17:00:00' }, // Friday
        { dayOfWeek: 6, startTime: '09:00:00', endTime: '16:00:00' }, // Saturday
      ];

      for (const availability of availabilityData) {
        await AppDataSource.query(
          `INSERT INTO doctor_availabilities (id, doctor_id, day_of_week, start_time, end_time, slot_duration, is_active, created_at, updated_at)
           VALUES (uuid_generate_v4(), $1, $2, $3, $4, 30, true, NOW(), NOW())`,
          [doctor.id, availability.dayOfWeek, availability.startTime, availability.endTime]
        );
      }

      console.log(`✅ Added availability for ${doctor.name}`);
    }

    console.log('\n🎉 All doctors now have availability schedules!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addDoctorAvailability();
