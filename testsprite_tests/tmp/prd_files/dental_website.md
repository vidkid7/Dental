# Om Chabahil Dental Hospital Website

## Project Overview
A modern dental clinic website with an admin panel for managing appointments, doctors, services, and content.

## Frontend URL
http://localhost:3000

## Features to Test

### 1. Public Website
- **Homepage** (`/`): Hero section, services preview, doctors section, testimonials
- **About Page** (`/about`): Clinic information, team, virtual tour
- **Services Page** (`/services`): List of all dental services
- **Doctors Page** (`/doctors`): Doctor profiles with specializations
- **Patients Page** (`/patients`): Patient information, FAQs, appointment booking info
- **Gallery Page** (`/gallery`): Photo and video gallery with filtering
- **Blog Page** (`/blog`): Dental articles and knowledge hub
- **Contact Page** (`/contact`): Contact form, location, working hours

### 2. Appointment Booking
- **Booking Page** (`/appointments/book`): Multi-step appointment booking form
- Select doctor, service, date/time
- Enter patient details
- Confirm booking

### 3. Admin Panel
- **Login** (`/admin/login`): Secure admin authentication
  - Email: admin@omchabahildental.com.np
  - Password: Admin@123
  - Remember me functionality
  - Forgot password flow

- **Dashboard** (`/admin`): Overview stats, recent appointments, enquiries

- **Doctors Management** (`/admin/doctors`):
  - List all doctors
  - Add new doctor
  - Edit doctor details
  - Toggle active/inactive status

- **Appointments Management** (`/admin/appointments`):
  - View all appointments
  - Filter by status
  - Confirm/cancel appointments
  - Mark as completed

- **Services Management** (`/admin/services`):
  - Add/edit services
  - Set pricing and duration
  - Toggle visibility

- **Content Management** (`/admin/content`):
  - Edit hero section
  - Edit about section
  - Manage statistics

- **Pages Management** (`/admin/content/pages`):
  - View all pages
  - Edit page SEO settings

- **Gallery Management** (`/admin/gallery`):
  - Upload images/videos
  - Categorize items
  - Toggle visibility
  - Delete items

- **Blog Management** (`/admin/blog`):
  - Create/edit posts
  - Publish/unpublish

- **Testimonials** (`/admin/testimonials`):
  - Add/edit testimonials
  - Set ratings
  - Toggle visibility

- **Enquiries** (`/admin/enquiries`):
  - View contact form submissions
  - Reply to enquiries
  - Archive

- **Media Library** (`/admin/media`):
  - Upload files
  - Organize media

- **Users** (`/admin/users`):
  - Manage admin users
  - Set roles
  - Reset passwords

- **Settings** (`/admin/settings`):
  - General settings
  - Contact info
  - Social media links
  - SEO settings

- **Security** (`/admin/settings/security`):
  - Change password
  - Two-factor authentication
  - Session management

## Test Scenarios

### Public Pages
1. Navigate to homepage and verify all sections load
2. Navigate through all public pages
3. Test responsive design
4. Test navigation menu

### Admin Panel
1. Login with valid credentials
2. Verify dashboard loads with stats
3. Navigate through all admin sections
4. Test CRUD operations on doctors
5. Test appointment management
6. Test content editing
7. Test logout functionality
