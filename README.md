# Premier Dental College & Hospital Website

A modern, premium dental college and multi-clinic website built with Next.js, NestJS, PostgreSQL, and Redis.

## Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS + Framer Motion
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT (role-based)
- **AI**: OpenAI API (chatbot)
- **Media Storage**: Cloudinary
- **Notifications**: Email (SMTP) + SMS/WhatsApp (mock, configurable)

## Project Structure

```
dental/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities and API client
│   │   └── types/     # TypeScript types
│   └── public/        # Static assets
│
├── backend/           # NestJS backend API
│   ├── src/
│   │   ├── common/    # Shared entities, DTOs
│   │   └── modules/   # Feature modules
│   │       ├── auth/
│   │       ├── users/
│   │       ├── doctors/
│   │       ├── appointments/
│   │       ├── departments/
│   │       ├── services/
│   │       ├── programs/
│   │       ├── admissions/
│   │       ├── blog/
│   │       ├── enquiries/
│   │       ├── testimonials/
│   │       ├── faculty/
│   │       ├── clinics/
│   │       ├── content/
│   │       ├── media/
│   │       ├── chatbot/
│   │       └── notifications/
│   └── database/      # Database scripts
│
└── docker-compose.yml # Local development services
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Setup

```bash
# Copy environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Update the environment files with your configuration.

### 3. Start Development Services

```bash
# Start PostgreSQL, Redis, and MailHog
npm run docker:up

# Or use docker-compose directly
docker-compose up -d
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api/v1
- **API Docs**: http://localhost:3001/docs
- **MailHog**: http://localhost:8025 (email testing)

## Default Admin Credentials

- **Email**: admin@premierdentalcollege.edu
- **Password**: Admin@123

## API Documentation

The API documentation is available at `/docs` when running the backend in development mode. It provides:
- Interactive Swagger UI
- All available endpoints
- Request/response schemas
- Authentication requirements

## Features

### Public Pages
- Home page with hero, services, testimonials
- About Us
- Services catalog
- Academic Programs (BDS, MDS, Internships)
- Doctor profiles
- Blog / Dental Knowledge Hub
- Contact with location map

### Patient Features
- Online appointment booking
- Doctor availability checking
- Appointment confirmation (email + SMS)
- WhatsApp integration

### Student Features
- Online admission application
- Document upload
- Application tracking
- Program information

### Admin Panel
- Content management (CMS)
- Doctor & faculty management
- Appointment management
- Admission management
- Blog management
- Enquiry management
- Media library
- SEO controls
- Chatbot configuration

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### Backend (.env)

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=dental_user
DATABASE_PASSWORD=dental_password
DATABASE_NAME=dental_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# OpenAI
OPENAI_API_KEY=

# SMTP
SMTP_HOST=localhost
SMTP_PORT=1025
```

## Deployment

### Railway Deployment

1. Create a new project on Railway
2. Add PostgreSQL and Redis services
3. Deploy the backend:
   ```bash
   cd backend
   railway up
   ```
4. Deploy the frontend:
   ```bash
   cd frontend
   railway up
   ```
5. Configure environment variables in Railway dashboard

## Testing

```bash
# Run backend tests
cd backend && npm run test

# Run frontend tests
cd frontend && npm run test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Private - All rights reserved
