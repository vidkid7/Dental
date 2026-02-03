# Om Chabahil Dental Hospital Website

A modern, full-stack dental college and hospital website built with Next.js and NestJS.

## 🏥 About

Om Chabahil Dental Hospital website provides:
- Patient appointment booking system
- Doctor profiles and schedules
- Academic programs information
- Blog and news section
- Media gallery
- Admin panel for content management
- AI-powered chatbot for patient queries

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **Passport JWT** - Authentication
- **Cloudinary** - Media storage
- **OpenAI** - Chatbot integration

## 📁 Project Structure

```
dental-college-website/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── common/      # Shared utilities
│   │   └── main.ts      # Entry point
│   └── database/        # Database scripts
├── frontend/            # Next.js app
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities
│   └── public/         # Static assets
└── images/             # Local media files
```

## 🚀 Deployment

This project is configured for deployment on **Railway**.

### Quick Deploy to Railway

1. **Backup your local database:**
   ```bash
   mkdir backups
   pg_dump -h localhost -p 5432 -U dental_user -d dental_db -F p -f backups/dental_db_backup.sql
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```

3. **Follow the deployment guide:**
   See [RAILWAY_DEPLOYMENT_STEPS.md](./RAILWAY_DEPLOYMENT_STEPS.md) for detailed instructions.

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials

5. Run database migrations:
   ```bash
   npm run migration:run
   ```

6. Start development server:
   ```bash
   npm run start:dev
   ```

Backend runs on: http://localhost:3001

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your credentials

5. Start development server:
   ```bash
   npm run dev
   ```

Frontend runs on: http://localhost:3000

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=dental_user
DATABASE_PASSWORD=dental_password
DATABASE_NAME=dental_db
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
OPENAI_API_KEY=your-openai-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_ENABLE_CHATBOT=true
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger Docs: http://localhost:3001/docs
- API Health: http://localhost:3001/health

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Features

- ✅ Patient appointment booking
- ✅ Doctor management
- ✅ Department & services management
- ✅ Academic programs
- ✅ Blog & news
- ✅ Media gallery with Cloudinary
- ✅ Admin panel
- ✅ AI chatbot
- ✅ Email notifications
- ✅ WhatsApp integration (planned)
- ✅ SMS notifications (planned)

## 🤝 Contributing

This is a private project for Om Chabahil Dental Hospital.

## 📄 License

Private - All rights reserved

## 📞 Contact

Om Chabahil Dental Hospital
- Address: Chabahil, Koteshwor, Kathmandu, Nepal
- Phone: +977 9841-234567
- Email: info@omchabahildental.com.np

---

**Deployed on Railway** 🚂
