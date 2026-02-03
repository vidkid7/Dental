// ============================================
// Common Types
// ============================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// User & Authentication
// ============================================

export type UserRole = 'admin' | 'super_admin' | 'doctor' | 'staff' | 'student';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// Doctor
// ============================================

export interface Doctor extends BaseEntity {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  qualification: string;
  specialization: string;
  department: Department;
  departmentId: string;
  experience: number; // years
  consultationFee?: number;
  bio?: string;
  isActive: boolean;
  availabilities?: DoctorAvailability[];
}

export interface DoctorAvailability extends BaseEntity {
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
  slotDuration: number; // minutes (10, 15, 30)
  isActive: boolean;
}

export interface DoctorLeave extends BaseEntity {
  doctorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

// ============================================
// Department
// ============================================

export interface Department extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

// ============================================
// Appointment
// ============================================

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'no_show';

export interface Appointment extends BaseEntity {
  doctorId: string;
  doctor?: Doctor;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  reminderSent: boolean;
}

export interface CreateAppointmentDto {
  doctorId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// ============================================
// Academic Programs
// ============================================

export type ProgramType = 'bds' | 'mds' | 'internship' | 'certificate';

export interface AcademicProgram extends BaseEntity {
  name: string;
  slug: string;
  type: ProgramType;
  duration: string;
  description: string;
  eligibility: string;
  curriculum?: string;
  fees?: string;
  seats?: number;
  image?: string;
  isActive: boolean;
}

// ============================================
// Admission Application
// ============================================

export type ApplicationStatus = 
  | 'draft'
  | 'submitted' 
  | 'under_review' 
  | 'shortlisted' 
  | 'accepted' 
  | 'rejected';

export interface AdmissionApplication extends BaseEntity {
  applicationNumber: string;
  programId: string;
  program?: AcademicProgram;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  address: string;
  
  // Academic Info
  previousEducation: string;
  percentage: number;
  passingYear: number;
  
  // Documents
  documents: ApplicationDocument[];
  
  status: ApplicationStatus;
  remarks?: string;
}

export interface ApplicationDocument {
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
}

// ============================================
// Services
// ============================================

export interface Service extends BaseEntity {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  image?: string;
  gallery?: string[];
  departmentId?: string;
  department?: Department;
  isActive: boolean;
  order: number;
}

// ============================================
// Blog / Articles
// ============================================

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  authorId?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  readingTime: number;
}

// ============================================
// Testimonials
// ============================================

export interface Testimonial extends BaseEntity {
  name: string;
  role: string; // e.g., "Patient", "Student", "Alumni"
  content: string;
  rating: number;
  photo?: string;
  isActive: boolean;
  order: number;
}

// ============================================
// Faculty
// ============================================

export interface Faculty extends BaseEntity {
  name: string;
  designation: string;
  qualification: string;
  departmentId: string;
  department?: Department;
  photo?: string;
  email?: string;
  specialization?: string;
  bio?: string;
  publications?: string[];
  isActive: boolean;
  order: number;
}

// ============================================
// Clinic / Location
// ============================================

export interface Clinic extends BaseEntity {
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  workingHours: ClinicWorkingHours[];
  services?: string[];
  images?: string[];
  isMain: boolean;
  isActive: boolean;
}

export interface ClinicWorkingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// ============================================
// Enquiry
// ============================================

export type EnquiryType = 
  | 'general' 
  | 'appointment' 
  | 'admission' 
  | 'services' 
  | 'feedback' 
  | 'complaint';

export type EnquiryStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export interface Enquiry extends BaseEntity {
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  assignedTo?: string;
  response?: string;
  respondedAt?: string;
}

// ============================================
// Media
// ============================================

export interface MediaFile extends BaseEntity {
  name: string;
  url: string;
  publicId: string;
  type: 'image' | 'video' | 'document';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folder?: string;
  alt?: string;
  caption?: string;
}

// ============================================
// SEO
// ============================================

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown>;
}

// ============================================
// Page Content (CMS)
// ============================================

export interface PageContent extends BaseEntity {
  pageSlug: string;
  sectionKey: string;
  content: Record<string, unknown>;
  seo?: SEOData;
}

// ============================================
// Settings
// ============================================

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}
