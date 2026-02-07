--
-- PostgreSQL database dump
--

\restrict 34EDXGGgC45l2udrfar9fFOLbG7zbkfwZdB4UMfPrbvBfTfhEeExD0eVVTsgVD5

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: academic_programs_type_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.academic_programs_type_enum AS ENUM (
    'bds',
    'mds',
    'internship',
    'certificate'
);


ALTER TYPE public.academic_programs_type_enum OWNER TO dental_user;

--
-- Name: admission_applications_gender_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.admission_applications_gender_enum AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public.admission_applications_gender_enum OWNER TO dental_user;

--
-- Name: admission_applications_status_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.admission_applications_status_enum AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'shortlisted',
    'accepted',
    'rejected'
);


ALTER TYPE public.admission_applications_status_enum OWNER TO dental_user;

--
-- Name: appointments_status_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.appointments_status_enum AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'no_show'
);


ALTER TYPE public.appointments_status_enum OWNER TO dental_user;

--
-- Name: enquiries_status_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.enquiries_status_enum AS ENUM (
    'new',
    'in_progress',
    'resolved',
    'closed'
);


ALTER TYPE public.enquiries_status_enum OWNER TO dental_user;

--
-- Name: enquiries_type_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.enquiries_type_enum AS ENUM (
    'general',
    'appointment',
    'admission',
    'services',
    'feedback',
    'complaint'
);


ALTER TYPE public.enquiries_type_enum OWNER TO dental_user;

--
-- Name: media_files_type_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.media_files_type_enum AS ENUM (
    'image',
    'video',
    'document'
);


ALTER TYPE public.media_files_type_enum OWNER TO dental_user;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: dental_user
--

CREATE TYPE public.users_role_enum AS ENUM (
    'super_admin',
    'admin',
    'staff'
);


ALTER TYPE public.users_role_enum OWNER TO dental_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_programs; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.academic_programs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    type public.academic_programs_type_enum NOT NULL,
    duration character varying NOT NULL,
    description text NOT NULL,
    eligibility text NOT NULL,
    curriculum text,
    fees character varying,
    seats integer,
    image character varying,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.academic_programs OWNER TO dental_user;

--
-- Name: admission_applications; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.admission_applications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    application_number character varying NOT NULL,
    program_id uuid NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    date_of_birth date NOT NULL,
    gender public.admission_applications_gender_enum NOT NULL,
    nationality character varying NOT NULL,
    address text NOT NULL,
    previous_education character varying NOT NULL,
    percentage numeric(5,2) NOT NULL,
    passing_year integer NOT NULL,
    documents jsonb DEFAULT '[]'::jsonb NOT NULL,
    status public.admission_applications_status_enum DEFAULT 'draft'::public.admission_applications_status_enum NOT NULL,
    remarks text
);


ALTER TABLE public.admission_applications OWNER TO dental_user;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    doctor_id uuid NOT NULL,
    patient_name character varying NOT NULL,
    patient_email character varying NOT NULL,
    patient_phone character varying NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status public.appointments_status_enum DEFAULT 'pending'::public.appointments_status_enum NOT NULL,
    notes text,
    cancellation_reason text,
    reminder_sent boolean DEFAULT false NOT NULL,
    confirmation_sent boolean DEFAULT false NOT NULL
);


ALTER TABLE public.appointments OWNER TO dental_user;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    featured_image character varying,
    author character varying NOT NULL,
    author_id uuid,
    category character varying NOT NULL,
    tags text DEFAULT '[]'::text NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp without time zone,
    views integer DEFAULT 0 NOT NULL,
    reading_time integer DEFAULT 5 NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO dental_user;

--
-- Name: clinics; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.clinics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    address character varying NOT NULL,
    city character varying NOT NULL,
    state character varying NOT NULL,
    postal_code character varying NOT NULL,
    country character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    working_hours jsonb DEFAULT '[]'::jsonb NOT NULL,
    services text,
    images text,
    is_main boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.clinics OWNER TO dental_user;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.departments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description text,
    icon character varying,
    image character varying,
    is_active boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.departments OWNER TO dental_user;

--
-- Name: doctor_availabilities; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.doctor_availabilities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    doctor_id uuid NOT NULL,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    slot_duration integer DEFAULT 15 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.doctor_availabilities OWNER TO dental_user;

--
-- Name: doctor_leaves; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.doctor_leaves (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    doctor_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text
);


ALTER TABLE public.doctor_leaves OWNER TO dental_user;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.doctors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    photo character varying,
    qualification character varying NOT NULL,
    specialization character varying NOT NULL,
    department_id uuid NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    consultation_fee numeric(10,2),
    bio text,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.doctors OWNER TO dental_user;

--
-- Name: enquiries; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.enquiries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    type public.enquiries_type_enum DEFAULT 'general'::public.enquiries_type_enum NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    subject character varying NOT NULL,
    message text NOT NULL,
    status public.enquiries_status_enum DEFAULT 'new'::public.enquiries_status_enum NOT NULL,
    assigned_to uuid,
    response text,
    responded_at timestamp without time zone
);


ALTER TABLE public.enquiries OWNER TO dental_user;

--
-- Name: faculty; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.faculty (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    designation character varying NOT NULL,
    qualification character varying NOT NULL,
    department_id uuid NOT NULL,
    photo character varying,
    email character varying,
    specialization character varying,
    bio text,
    publications text,
    is_active boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.faculty OWNER TO dental_user;

--
-- Name: media_files; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.media_files (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    url character varying NOT NULL,
    public_id character varying NOT NULL,
    type public.media_files_type_enum NOT NULL,
    mime_type character varying NOT NULL,
    size integer NOT NULL,
    width integer,
    height integer,
    folder character varying,
    alt character varying,
    caption character varying
);


ALTER TABLE public.media_files OWNER TO dental_user;

--
-- Name: page_content; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.page_content (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    page_slug character varying NOT NULL,
    section_key character varying NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    seo jsonb
);


ALTER TABLE public.page_content OWNER TO dental_user;

--
-- Name: services; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.services (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    short_description text NOT NULL,
    description text NOT NULL,
    icon character varying,
    image character varying,
    gallery text,
    department_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.services OWNER TO dental_user;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    key character varying NOT NULL,
    value text NOT NULL,
    category character varying,
    description text
);


ALTER TABLE public.settings OWNER TO dental_user;

--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.testimonials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL,
    content text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    photo character varying,
    is_active boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.testimonials OWNER TO dental_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: dental_user
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    role public.users_role_enum DEFAULT 'staff'::public.users_role_enum NOT NULL,
    avatar character varying,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp without time zone,
    refresh_token character varying
);


ALTER TABLE public.users OWNER TO dental_user;

--
-- Data for Name: academic_programs; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.academic_programs (id, created_at, updated_at, name, slug, type, duration, description, eligibility, curriculum, fees, seats, image, is_active) FROM stdin;
02a98cd5-3786-4a69-8292-9d7672a93374	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Bachelor of Dental Surgery (BDS)	bds	bds	5 years (4 years + 1 year internship)	The BDS program provides comprehensive education in dental sciences, combining theoretical knowledge with practical clinical experience. Our flagship undergraduate program providing comprehensive education in dental sciences with extensive clinical training.	10+2 with Physics, Chemistry, Biology with minimum 50% marks. Valid entrance exam score. Age: 17-25 years.	\N	\N	\N	\N	t
c2061b63-c74b-40fe-8ed2-c8dc67720d40	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Orthodontics	mds-orthodontics	mds	3 years	Advanced specialization in orthodontics, focusing on diagnosis and treatment of dental and facial irregularities. Advanced specialization programs in various dental disciplines for those seeking expertise in specific areas.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
fca73666-f303-4efa-943f-fa27dddb7d15	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Oral Surgery	mds-oral-surgery	mds	3 years	Advanced specialization in oral and maxillofacial surgery, including complex surgical procedures.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
6a373e86-6d2a-4feb-bd2b-aa87756cfe1c	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Prosthodontics	mds-prosthodontics	mds	3 years	Advanced specialization in prosthodontics and crown bridge procedures.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
ba92d47d-68da-4e16-9d33-32756e162a85	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Endodontics	mds-endodontics	mds	3 years	Advanced specialization in conservative dentistry and endodontics.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
dd8fca6d-1acd-43fc-ab27-70a4a0341378	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Periodontics	mds-periodontics	mds	3 years	Advanced specialization in periodontics and gum disease treatment.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
b6a30e66-753c-4256-86dd-eed7e3c28bda	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Pedodontics	mds-pedodontics	mds	3 years	Advanced specialization in pedodontics and preventive dentistry.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
c5b8ef40-feb1-4746-8b39-b52626db4994	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Oral Pathology	mds-oral-pathology	mds	3 years	Advanced specialization in oral pathology and microbiology.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
f8fa07a3-630d-4b6f-9aff-381d342276d2	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Master of Dental Surgery (MDS) - Public Health Dentistry	mds-public-health	mds	3 years	Advanced specialization in public health dentistry.	BDS degree from recognized university. Valid entrance exam score.	\N	\N	\N	\N	t
96a030ec-668e-40e0-af75-5d79e4a08808	2026-02-02 20:24:43.489519	2026-02-02 20:24:43.489519	Dental Internship Program	internship	internship	1 year	Mandatory rotational internship program providing hands-on clinical experience across all dental specialties. Comprehensive rotational internship providing hands-on experience across all dental specialties.	Final year BDS students or recent graduates.	\N	\N	\N	\N	t
\.


--
-- Data for Name: admission_applications; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.admission_applications (id, created_at, updated_at, application_number, program_id, first_name, last_name, email, phone, date_of_birth, gender, nationality, address, previous_education, percentage, passing_year, documents, status, remarks) FROM stdin;
6e101a68-8671-4dc5-9d01-38f76fdd2954	2026-01-23 20:38:34.968884	2026-01-23 20:38:34.968884	APP-2026-001	02a98cd5-3786-4a69-8292-9d7672a93374	Raj	Kumar	raj.kumar@example.com	+977 9841-111111	2005-05-15	male	Nepali	Kathmandu, Nepal	10+2 Science	85.50	2023	[]	submitted	\N
3d54e2e2-6fe3-4679-a465-cb90052a5c8c	2026-01-25 20:38:34.968884	2026-01-31 20:38:34.968884	APP-2026-002	02a98cd5-3786-4a69-8292-9d7672a93374	Sita	Devi	sita.devi@example.com	+977 9841-222222	2004-08-20	female	Nepali	Pokhara, Nepal	10+2 Science	92.00	2023	[]	under_review	Application under review by admission committee
44730923-d5e1-4828-b4ff-23dd9df746d0	2026-01-18 20:38:34.968884	2026-01-28 20:38:34.968884	APP-2026-003	c2061b63-c74b-40fe-8ed2-c8dc67720d40	Amit	Shrestha	amit.shrestha@example.com	+977 9841-333333	1998-03-10	male	Nepali	Lalitpur, Nepal	BDS	78.50	2022	[]	shortlisted	Candidate shortlisted for interview
7f3956ce-df18-4ba4-b326-1c160c773544	2026-01-13 20:38:34.968884	2026-01-23 20:38:34.968884	APP-2026-004	02a98cd5-3786-4a69-8292-9d7672a93374	Maya	Thapa	maya.thapa@example.com	+977 9841-444444	2005-11-25	female	Nepali	Bhaktapur, Nepal	10+2 Science	88.00	2023	[]	accepted	Congratulations! Your application has been accepted.
11ac622e-89e9-4c19-9bc1-64a809b03a04	2026-01-21 20:38:34.968884	2026-01-25 20:38:34.968884	APP-2026-005	02a98cd5-3786-4a69-8292-9d7672a93374	Hari	Prasad	hari.prasad@example.com	+977 9841-555555	2004-07-12	male	Nepali	Kathmandu, Nepal	10+2 Science	65.00	2023	[]	rejected	Application does not meet minimum eligibility criteria
a0e4781a-4597-4450-b934-038398c6652d	2026-01-30 20:38:34.968884	2026-01-30 20:38:34.968884	APP-2026-006	fca73666-f303-4efa-943f-fa27dddb7d15	Bikash	Maharjan	bikash.maharjan@example.com	+977 9841-666666	1997-09-05	male	Nepali	Kathmandu, Nepal	BDS	82.00	2021	[]	draft	\N
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.appointments (id, created_at, updated_at, doctor_id, patient_name, patient_email, patient_phone, date, start_time, end_time, status, notes, cancellation_reason, reminder_sent, confirmation_sent) FROM stdin;
4aca9ddf-510e-4c62-8ade-6e8e2d23039e	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	371e3673-8e46-4bf0-b164-f4f463b194f8	Ram Sharma	ram.sharma@example.com	+977 9841-111111	2026-02-03	09:00:00	09:30:00	confirmed	Regular checkup appointment	\N	t	t
c23a471d-1487-4eda-a949-b33b72ee97b6	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	Sita Thapa	sita.thapa@example.com	+977 9841-222222	2026-02-04	10:30:00	11:00:00	pending	Orthodontic consultation	\N	f	f
8a86aff7-f48a-46ed-8723-c1cc54718a14	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	Hari Prasad	hari.prasad@example.com	+977 9841-333333	2026-02-05	11:00:00	11:30:00	confirmed	Tooth extraction consultation	\N	t	t
1ecd32ba-3a26-44e4-a6e5-9b72e2b63092	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	4ba6ad18-9867-4170-b595-57aea22234b4	Maya Gurung	maya.gurung@example.com	+977 9841-444444	2026-01-31	14:00:00	15:00:00	completed	Root canal treatment completed successfully	\N	t	t
6ccd172a-3403-4a52-8241-244f316a9996	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	Krishna Adhikari	krishna.adhikari@example.com	+977 9841-555555	2026-02-07	15:00:00	15:30:00	pending	Dental crown consultation	\N	f	f
eca8860d-9738-4cc3-adc9-8658710073b8	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	c92603e3-bb3d-4372-a334-712b0d07def2	Anjali Shrestha	anjali.shrestha@example.com	+977 9841-666666	2026-02-03	10:00:00	10:30:00	confirmed	Child dental checkup	\N	t	t
72eb6d32-d058-4fcc-844f-fed07eba1fba	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	25bfd927-3f94-468d-96cd-1e9a898ef986	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-777777	2026-01-28	09:30:00	10:00:00	completed	Gum treatment completed	\N	t	t
12f8e70d-5bd6-4dd3-8a54-54b80deb4871	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	371e3673-8e46-4bf0-b164-f4f463b194f8	Nabin Karki	nabin.karki@example.com	+977 9841-999999	2026-02-01	11:30:00	12:00:00	cancelled	Patient cancelled due to emergency	\N	f	f
0d43d562-6149-4668-856b-027b2ac42e29	2026-02-02 20:38:12.48778	2026-02-02 20:38:12.48778	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	Prabin Thapa	prabin.thapa@example.com	+977 9841-101010	2026-01-30	14:30:00	15:00:00	no_show	Patient did not show up	\N	t	f
93f483be-97ba-4e50-8afd-de3e4b0a14b1	2026-02-02 20:38:12.48778	2026-02-02 20:42:09.633219	77c31f8b-f244-41c9-9796-41ece521de78	Sangita Tamang	sangita.tamang@example.com	+977 9841-888888	2026-02-09	16:00:00	17:00:00	confirmed	Teeth whitening consultation	\N	f	f
6cc1eee6-50cb-4865-8837-16cac8d3cf5b	2026-02-02 21:05:23.237724	2026-02-02 21:06:47.401017	50319dd2-363f-45c6-8848-d68f747bfba8	uisuhiu	hkhk2@iuiug.kk	9686868989	2026-02-11	09:30:00	10:00:00	completed	kjyggjkgjk	\N	f	f
45b95c62-8ceb-457c-b5c2-d354b5aa57cf	2026-02-02 22:30:22.539201	2026-02-02 22:30:22.539201	4ba6ad18-9867-4170-b595-57aea22234b4	jgkjg	jgkjgjgj@iuiu.ujg	6576890768	2026-02-07	10:30:00	11:00:00	pending	fhgukiloikgjfh	\N	f	f
45f1f09c-cd5d-495e-ad96-d612b86f6e88	2026-02-02 23:31:32.660294	2026-02-02 23:31:32.660294	371e3673-8e46-4bf0-b164-f4f463b194f8	yfjug	fhfj@ythfh.jyuy	3456789765	2026-02-05	09:30:00	10:00:00	pending	tdhfjgkl;l	\N	f	f
ea36e63e-3550-4e1c-89b0-4c800f253cc9	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	371e3673-8e46-4bf0-b164-f4f463b194f8	Ram Sharma	ram.sharma@example.com	+977 9841-111111	2026-02-04	09:00:00	09:30:00	confirmed	Regular checkup appointment	\N	t	t
458def1a-88bd-440d-a143-96aff4b56668	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	Sita Thapa	sita.thapa@example.com	+977 9841-222222	2026-02-05	10:30:00	11:00:00	pending	Orthodontic consultation	\N	f	f
f5d18369-046b-4740-aebb-0734581dbde0	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	Hari Prasad	hari.prasad@example.com	+977 9841-333333	2026-02-06	11:00:00	11:30:00	confirmed	Tooth extraction consultation	\N	t	t
56b3adfe-a731-40db-b422-bd4bb6ca1df5	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	4ba6ad18-9867-4170-b595-57aea22234b4	Maya Gurung	maya.gurung@example.com	+977 9841-444444	2026-02-01	14:00:00	15:00:00	completed	Root canal treatment completed successfully	\N	t	t
a6117f62-8369-4fd5-b7cd-a4e0f1510bd8	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	Krishna Adhikari	krishna.adhikari@example.com	+977 9841-555555	2026-02-08	15:00:00	15:30:00	pending	Dental crown consultation	\N	f	f
2d031979-38d2-4095-a8a9-14bbf995582a	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	c92603e3-bb3d-4372-a334-712b0d07def2	Anjali Shrestha	anjali.shrestha@example.com	+977 9841-666666	2026-02-04	10:00:00	10:30:00	confirmed	Child dental checkup	\N	t	t
b9198108-f6fa-4670-b0e9-beb2bc528c02	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	25bfd927-3f94-468d-96cd-1e9a898ef986	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-777777	2026-01-29	09:30:00	10:00:00	completed	Gum treatment completed	\N	t	t
5ca55bad-5ee5-4e60-873f-445eab5726c6	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	77c31f8b-f244-41c9-9796-41ece521de78	Sangita Tamang	sangita.tamang@example.com	+977 9841-888888	2026-02-10	16:00:00	17:00:00	pending	Teeth whitening consultation	\N	f	f
5d79c986-e4af-483b-a3a6-46e68936633c	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	371e3673-8e46-4bf0-b164-f4f463b194f8	Nabin Karki	nabin.karki@example.com	+977 9841-999999	2026-02-02	11:30:00	12:00:00	cancelled	Patient cancelled due to emergency	\N	f	f
0a60366f-823d-4498-a633-65d0198f17a1	2026-02-03 17:46:45.110007	2026-02-03 17:46:45.110007	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	Prabin Thapa	prabin.thapa@example.com	+977 9841-101010	2026-01-31	14:30:00	15:00:00	no_show	Patient did not show up	\N	t	f
4958a694-7ae9-4579-8f3e-0eb602391a0f	2026-02-03 17:49:16.990638	2026-02-03 17:49:16.990638	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	Test Patient	test@example.com	+977 9841234567	2026-02-04	10:00:00	10:30:00	pending	Test appointment	\N	f	f
e5f8f800-4885-4acb-b36e-7a99da41ec20	2026-02-03 17:50:17.441543	2026-02-03 17:51:06.291712	50319dd2-363f-45c6-8848-d68f747bfba8	gfcgh	sfgfdgf@rtd.jj	345678764	2026-02-20	09:30:00	10:00:00	confirmed	rdtfgyhujkl	\N	f	f
f953c616-b4b4-49f5-a04d-cc246236966b	2026-02-03 18:16:55.044611	2026-02-03 18:16:55.044611	371e3673-8e46-4bf0-b164-f4f463b194f8	htfg	hgjhg@llkl.lll	1234567890	2026-02-12	10:00:00	10:30:00	pending	asdfghjkl	\N	f	f
ecfe0f14-1c98-4dff-ba4c-dbb9667ea30c	2026-02-03 18:27:54.128928	2026-02-03 18:28:37.158545	1bad63fb-b9f3-4bed-aeb5-c37d8656c5bc	esdfghjk	6ghjk@tfhj.ppp	0987654321	2026-02-08	10:01:00	10:31:00	confirmed	asdfghjkl	\N	f	f
0a468b1a-8052-41c3-8b1b-f058c346f25f	2026-02-03 18:38:57.186274	2026-02-03 18:38:57.186274	78a4c98f-d693-49da-9c16-130b193de351	lalalalallala	lalalal@lala.lala	1234567890	2026-02-02	10:00:00	10:30:00	pending	lalalalallala	\N	f	f
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.blog_posts (id, created_at, updated_at, title, slug, excerpt, content, featured_image, author, author_id, category, tags, is_published, published_at, views, reading_time) FROM stdin;
c79c7f84-de0b-4120-8523-9db8a44169f6	2026-02-02 20:24:43.658772	2026-02-02 20:24:43.658772	Modern Orthodontics: Beyond Traditional Braces	modern-orthodontics-beyond-braces	Explore the latest advancements in orthodontic treatment, from clear aligners to lingual braces.	<h2>Introduction to Modern Orthodontics</h2><p>Orthodontic treatment has evolved significantly, offering patients more options than ever before.</p><h2>Clear Aligners (Invisalign)</h2><p>Clear aligners are virtually invisible, removable, and comfortable. They are perfect for adults and teens who want a discreet treatment option.</p><h2>Ceramic Braces</h2><p>Ceramic braces use tooth-colored brackets that blend with your natural teeth, making them less noticeable than traditional metal braces.</p><h2>Lingual Braces</h2><p>Lingual braces are placed on the back of your teeth, making them completely invisible from the front.</p><h2>Self-Ligating Braces</h2><p>These braces use a special clip instead of elastic bands, reducing friction and potentially shortening treatment time.</p><h2>Digital Treatment Planning</h2><p>Modern orthodontics uses 3D imaging and digital planning for more precise and predictable results.</p><h2>Choosing the Right Option</h2><p>Your orthodontist will help you choose the best treatment option based on your specific needs, lifestyle, and treatment goals.</p><h2>Conclusion</h2><p>With so many options available, achieving a straight, healthy smile is more accessible than ever.</p>	/images/blog-3.jpg	Dr. Michael Chen	\N	Orthodontics	{orthodontics,braces,"clear aligners","smile correction"}	t	2026-02-02 20:24:43.658772	0	6
d84065ae-949e-43bf-8200-95fe5f79c056	2026-02-02 20:24:43.658772	2026-02-04 11:14:45.181117	Understanding the BDS Program: A Complete Guide	understanding-bds-program	Everything you need to know about pursuing a Bachelor of Dental Surgery degree at our institution.	<h2>What is BDS?</h2><p>The Bachelor of Dental Surgery (BDS) is an undergraduate degree program that prepares students for a career in dentistry.</p><h2>Program Duration</h2><p>The BDS program typically lasts 5 years, including 4 years of academic study and 1 year of mandatory internship.</p><h2>Curriculum Overview</h2><p>Our BDS program covers:</p><ul><li>Basic medical sciences</li><li>Dental sciences</li><li>Clinical training</li><li>Research methodology</li></ul><h2>Career Opportunities</h2><p>BDS graduates can work as general dentists, pursue specializations, or enter research and academia.</p><h2>Admission Requirements</h2><p>To apply for BDS, you need:</p><ul><li>10+2 with Physics, Chemistry, and Biology</li><li>Minimum 50% marks</li><li>Valid entrance exam score</li><li>Age between 17-25 years</li></ul><h2>Why Choose Our Program?</h2><p>Our BDS program offers comprehensive education, hands-on clinical experience, modern facilities, and expert faculty mentorship.</p>	/images/blog-2.jpg	Admin	\N	Education	{BDS,"dental education",academics,career}	t	2026-02-02 20:24:43.658772	2	8
61b37c35-8e55-40d6-be0c-63c9c3976ad8	2026-02-02 20:24:43.658772	2026-02-02 20:33:40.837687	10 Essential Tips for Maintaining Oral Health	10-essential-tips-for-oral-health	Discover the key practices that can help you maintain a healthy smile and prevent dental problems.	<h2>Introduction</h2><p>Maintaining good oral health is essential for your overall well-being. Here are 10 essential tips to keep your teeth and gums healthy.</p><h2>1. Brush Twice Daily</h2><p>Brush your teeth at least twice a day with fluoride toothpaste. Use a soft-bristled toothbrush and replace it every three to four months.</p><h2>2. Floss Regularly</h2><p>Flossing removes plaque and food particles between teeth that brushing cannot reach. Make it a daily habit.</p><h2>3. Use Mouthwash</h2><p>Antimicrobial mouthwash can help reduce bacteria and prevent gum disease.</p><h2>4. Eat a Balanced Diet</h2><p>Limit sugary and acidic foods. Eat plenty of fruits, vegetables, and calcium-rich foods.</p><h2>5. Stay Hydrated</h2><p>Drinking water helps wash away food particles and keeps your mouth moist.</p><h2>6. Avoid Tobacco</h2><p>Smoking and chewing tobacco increase the risk of gum disease and oral cancer.</p><h2>7. Limit Alcohol</h2><p>Excessive alcohol consumption can lead to oral health problems.</p><h2>8. Protect Your Teeth</h2><p>Wear a mouthguard during sports and avoid using your teeth as tools.</p><h2>9. Regular Dental Checkups</h2><p>Visit your dentist every six months for professional cleanings and examinations.</p><h2>10. Address Problems Early</h2><p>Don't ignore dental pain or problems. Early treatment prevents more serious issues.</p><h2>Conclusion</h2><p>Following these tips can help you maintain excellent oral health and a beautiful smile for years to comes.</p>	/images/blog-1.jpg	Dr. Sarah Johnson	\N	Dental Care	{"oral health","dental tips",prevention,hygiene}	t	2026-02-02 20:24:43.658772	2	1
\.


--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.clinics (id, created_at, updated_at, name, slug, address, city, state, postal_code, country, phone, email, latitude, longitude, working_hours, services, images, is_main, is_active) FROM stdin;
441b0628-6f65-4a6e-b3d9-f01713519beb	2026-02-02 20:24:43.509161	2026-02-02 20:24:43.509161	Om Chabahil Dental Hospital	om-chabahil-dental	Chabahil, Koteshwor	Kathmandu	Bagmati	44600	Nepal	+977 01-4812345	info@omchabahildental.com.np	27.71720000	85.34500000	[{"isClosed": false, "openTime": "07:00", "closeTime": "19:00", "dayOfWeek": 0}, {"isClosed": false, "openTime": "07:00", "closeTime": "19:00", "dayOfWeek": 1}, {"isClosed": false, "openTime": "07:00", "closeTime": "19:00", "dayOfWeek": 2}, {"isClosed": false, "openTime": "07:00", "closeTime": "19:00", "dayOfWeek": 3}, {"isClosed": false, "openTime": "07:00", "closeTime": "19:00", "dayOfWeek": 4}, {"isClosed": false, "openTime": "07:00", "closeTime": "19:00", "dayOfWeek": 5}, {"isClosed": false, "openTime": "08:00", "closeTime": "17:00", "dayOfWeek": 6}]	\N	\N	t	t
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.departments (id, created_at, updated_at, name, slug, description, icon, image, is_active, "order") FROM stdin;
fd147cf6-7398-4576-9260-adc44144a5e7	2026-02-02 16:22:30.495998	2026-02-02 16:22:30.495998	General Dentistry	general-dentistry	Comprehensive dental care including preventive and restorative treatments	\N	\N	t	1
c18471ff-2005-4944-afa3-29ff48ecd011	2026-02-02 16:22:30.527373	2026-02-02 16:22:30.527373	Orthodontics	orthodontics	Correction of teeth and jaw alignment using braces and aligners	\N	\N	t	2
0cb44c26-127f-4e4a-b8d9-2c93af561d40	2026-02-02 16:22:30.537268	2026-02-02 16:22:30.537268	Oral & Maxillofacial Surgery	oral-and-maxillofacial-surgery	Surgical procedures for the mouth, jaw, and face	\N	\N	t	3
1cf415be-42ee-4f61-952e-8a664f260710	2026-02-02 16:22:30.546672	2026-02-02 16:22:30.546672	Pediatric Dentistry	pediatric-dentistry	Specialized dental care for children and adolescents	\N	\N	t	4
5008ebb9-360e-498d-8462-5ecbda580ad3	2026-02-02 20:24:43.475631	2026-02-02 20:24:43.475631	Oral & Maxillofacial Surgery	oral-surgery	Surgical procedures for the mouth, jaw, and face	\N	\N	t	3
616df675-8aa6-4c76-bf8a-8a967a7e72cd	2026-02-02 20:24:43.475631	2026-02-02 20:24:43.475631	Periodontics	periodontics	Treatment of gum diseases and dental implants	\N	\N	t	5
0c50529e-cc42-4349-9460-d9718499faca	2026-02-02 20:24:43.475631	2026-02-02 20:24:43.475631	Prosthodontics	prosthodontics	Restoration and replacement of teeth with prosthetics	\N	\N	t	6
e67f6a85-f397-4aaa-895b-c03608b41ae8	2026-02-02 20:24:43.475631	2026-02-02 20:24:43.475631	Endodontics	endodontics	Root canal treatments and related procedures	\N	\N	t	7
599fe11f-cf0d-494e-a12a-7fc7dbb726c7	2026-02-02 20:24:43.475631	2026-02-02 20:24:43.475631	Oral Pathology	oral-pathology	Diagnosis and treatment of oral diseases	\N	\N	t	8
\.


--
-- Data for Name: doctor_availabilities; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.doctor_availabilities (id, created_at, updated_at, doctor_id, day_of_week, start_time, end_time, slot_duration, is_active) FROM stdin;
1b91131d-cdef-46d1-ab78-5141efc3647b	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	1	09:00:00	17:00:00	30	t
9b19f097-9688-47eb-8383-a4e351df0b61	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	c92603e3-bb3d-4372-a334-712b0d07def2	1	09:00:00	17:00:00	30	t
6b037c1a-d234-419f-9096-2bd22913637b	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	50319dd2-363f-45c6-8848-d68f747bfba8	1	09:00:00	17:00:00	30	t
62296022-b6c9-4959-ae78-73fa1c9140a8	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	25bfd927-3f94-468d-96cd-1e9a898ef986	1	09:00:00	17:00:00	30	t
27959709-d37f-4689-996d-92782c327439	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	4ba6ad18-9867-4170-b595-57aea22234b4	1	09:00:00	17:00:00	30	t
5ac04e58-ab9e-4690-962f-0d4129943f30	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	371e3673-8e46-4bf0-b164-f4f463b194f8	1	09:00:00	17:00:00	30	t
2707e0c9-c94c-49b9-976a-584d96830716	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	77c31f8b-f244-41c9-9796-41ece521de78	1	09:00:00	17:00:00	30	t
a853272b-d16a-4089-a343-f9d192aa6746	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	1	09:00:00	17:00:00	30	t
ceb3a938-d0ca-4b05-996b-1f2ac27ce094	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	1	09:00:00	17:00:00	30	t
1b3ac956-a487-4029-accb-244e64eb48f1	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	2	09:00:00	17:00:00	30	t
21ca8264-a29b-44c4-850c-0c8f3038a145	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	c92603e3-bb3d-4372-a334-712b0d07def2	2	09:00:00	17:00:00	30	t
acb28e92-b074-4b64-802b-51833cd3fa72	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	50319dd2-363f-45c6-8848-d68f747bfba8	2	09:00:00	17:00:00	30	t
94bacf17-e6f8-40bf-a1fc-adf8feaf999b	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	25bfd927-3f94-468d-96cd-1e9a898ef986	2	09:00:00	17:00:00	30	t
18ca8fba-5110-4069-8019-a10a353a4ce7	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	4ba6ad18-9867-4170-b595-57aea22234b4	2	09:00:00	17:00:00	30	t
981bb238-f60c-4667-94da-389b15a21694	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	371e3673-8e46-4bf0-b164-f4f463b194f8	2	09:00:00	17:00:00	30	t
c50b758d-83a9-4faf-a131-31919da2ab38	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	77c31f8b-f244-41c9-9796-41ece521de78	2	09:00:00	17:00:00	30	t
8ca44993-a142-44b5-ad0b-eab79ac75edd	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	2	09:00:00	17:00:00	30	t
ccf03902-4906-4cb7-8ac5-78d0cbf08267	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	2	09:00:00	17:00:00	30	t
2cb23cbf-5c73-4aae-af9f-ac4c86e1209c	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	3	09:00:00	17:00:00	30	t
6aeccfca-22b9-43d0-91e9-6a82427cecd4	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	c92603e3-bb3d-4372-a334-712b0d07def2	3	09:00:00	17:00:00	30	t
246151dc-a557-4def-953e-ddd77ecd3ff4	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	50319dd2-363f-45c6-8848-d68f747bfba8	3	09:00:00	17:00:00	30	t
31e1dc40-b7d4-44ad-9fe9-6fdc864a0dbb	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	25bfd927-3f94-468d-96cd-1e9a898ef986	3	09:00:00	17:00:00	30	t
122f46a1-f56f-4d1a-b051-75159c7b0d8b	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	4ba6ad18-9867-4170-b595-57aea22234b4	3	09:00:00	17:00:00	30	t
7bf28548-3165-41ed-85ac-519def8e0418	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	371e3673-8e46-4bf0-b164-f4f463b194f8	3	09:00:00	17:00:00	30	t
aa5510e8-3892-4b49-8d2d-33077b652445	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	77c31f8b-f244-41c9-9796-41ece521de78	3	09:00:00	17:00:00	30	t
1105d692-b2b5-4c4e-b48e-e61d86a1abfd	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	3	09:00:00	17:00:00	30	t
0895e01c-5735-4e75-a488-46926a34d448	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	3	09:00:00	17:00:00	30	t
027fc360-6e28-4dfc-8614-6ed71b30763b	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	4	09:00:00	17:00:00	30	t
2157081b-1c94-446e-9f99-630a45a7c643	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	c92603e3-bb3d-4372-a334-712b0d07def2	4	09:00:00	17:00:00	30	t
c130124b-14d7-4b9d-bbb0-426b7244ec1a	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	50319dd2-363f-45c6-8848-d68f747bfba8	4	09:00:00	17:00:00	30	t
c55bc417-ec0a-4a7f-a17f-be92bdcd2285	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	25bfd927-3f94-468d-96cd-1e9a898ef986	4	09:00:00	17:00:00	30	t
48cc22c5-eaaf-4769-9275-f747cd7758ec	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	4ba6ad18-9867-4170-b595-57aea22234b4	4	09:00:00	17:00:00	30	t
e4528808-225b-4814-beab-dde6afd442d7	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	371e3673-8e46-4bf0-b164-f4f463b194f8	4	09:00:00	17:00:00	30	t
a11dda3d-21e7-4530-8e7f-8ff845399a6f	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	77c31f8b-f244-41c9-9796-41ece521de78	4	09:00:00	17:00:00	30	t
2323ed5f-6573-4371-9150-4bc7333654d5	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	4	09:00:00	17:00:00	30	t
5bf12ebb-ce15-4705-9184-e0c19471b6d6	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	4	09:00:00	17:00:00	30	t
77ea9ff0-b822-4e9d-8c4a-c60738265fd9	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	5	09:00:00	17:00:00	30	t
1985564b-f39a-4480-bdb9-fdc4e04724fe	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	c92603e3-bb3d-4372-a334-712b0d07def2	5	09:00:00	17:00:00	30	t
4f12ff07-7feb-49f3-a783-406453787219	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	50319dd2-363f-45c6-8848-d68f747bfba8	5	09:00:00	17:00:00	30	t
be3a6776-fcac-4cfa-bc3c-2ffa9b6dc1f6	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	25bfd927-3f94-468d-96cd-1e9a898ef986	5	09:00:00	17:00:00	30	t
23e4a96e-8ed1-45fb-9bfc-0ee192af6ba1	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	4ba6ad18-9867-4170-b595-57aea22234b4	5	09:00:00	17:00:00	30	t
e0283974-b683-425a-9a2a-869d5d10e4bd	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	371e3673-8e46-4bf0-b164-f4f463b194f8	5	09:00:00	17:00:00	30	t
464bf949-e26c-4b32-9684-42890f23403e	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	77c31f8b-f244-41c9-9796-41ece521de78	5	09:00:00	17:00:00	30	t
6d31296e-3595-4199-9780-96975515c460	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	5	09:00:00	17:00:00	30	t
1d7b9201-8b7c-4438-8a6c-3ccec74a54c2	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	5	09:00:00	17:00:00	30	t
23d886f5-9149-425c-b603-612b0cdca53f	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	ccb0a0b6-aa76-487a-9fc2-9bad18316a26	6	09:00:00	16:00:00	30	t
3d3acfce-7cde-46f4-b2d5-d7cac71e628a	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	c92603e3-bb3d-4372-a334-712b0d07def2	6	09:00:00	16:00:00	30	t
6af28dd3-adf4-4191-9cad-8f655db1b468	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	25bfd927-3f94-468d-96cd-1e9a898ef986	6	09:00:00	16:00:00	30	t
e34e7c34-1176-4d2a-acfb-d4c2006f7895	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	4ba6ad18-9867-4170-b595-57aea22234b4	6	09:00:00	16:00:00	30	t
7fa4e94e-6643-47e8-ace6-32684f55d3ce	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	371e3673-8e46-4bf0-b164-f4f463b194f8	6	09:00:00	16:00:00	30	t
56cc29bc-3bc0-48f8-ae24-39206e8103c6	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	77c31f8b-f244-41c9-9796-41ece521de78	6	09:00:00	16:00:00	30	t
dbb6558e-7bee-418c-86c1-eff840d82605	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	8a8908ff-5dc0-4571-9564-cc22e8cc2b39	6	09:00:00	16:00:00	30	t
8df16b24-74b4-4b66-b355-5e050faf71f8	2026-02-02 21:03:43.368516	2026-02-02 21:03:43.368516	236ea465-f58d-44e2-9662-7ffc4b6ed9fa	6	09:00:00	16:00:00	30	t
a88cabfe-1180-458b-bc3a-62c5887e4b26	2026-02-02 23:43:55.654745	2026-02-02 23:43:55.654745	50319dd2-363f-45c6-8848-d68f747bfba8	6	09:00:00	17:00:00	30	t
efad7e85-7a55-42bf-a0de-b459ac2ec2b2	2026-02-03 00:15:52.412528	2026-02-03 00:15:52.412528	78a4c98f-d693-49da-9c16-130b193de351	1	09:00:00	17:00:00	30	t
555bbf5d-87b5-4323-96e8-07d5a46a02fe	2026-02-03 17:46:45.152033	2026-02-03 17:46:45.152033	78a4c98f-d693-49da-9c16-130b193de351	2	09:00:00	17:00:00	30	t
648b70d1-785a-4108-b14f-0f5b1c4a1994	2026-02-03 17:46:45.152033	2026-02-03 17:46:45.152033	78a4c98f-d693-49da-9c16-130b193de351	3	09:00:00	17:00:00	30	t
33c84df7-6f2e-4d59-b3b0-c842ce6be3aa	2026-02-03 17:46:45.152033	2026-02-03 17:46:45.152033	78a4c98f-d693-49da-9c16-130b193de351	4	09:00:00	17:00:00	30	t
8153cfe4-5dec-4d8b-a764-5d34ff3bd1f0	2026-02-03 17:46:45.152033	2026-02-03 17:46:45.152033	78a4c98f-d693-49da-9c16-130b193de351	5	09:00:00	17:00:00	30	t
3b0ed948-ba9c-4d26-830b-d3ee6f043bd2	2026-02-03 17:46:45.152033	2026-02-03 17:46:45.152033	78a4c98f-d693-49da-9c16-130b193de351	6	09:00:00	16:00:00	30	t
bf677e04-5363-44b8-88dd-0c731838f2bb	2026-02-03 17:52:02.751554	2026-02-03 17:52:02.751554	27786004-478a-40f8-bbce-7ab670a8401f	2	09:00:00	17:00:00	30	t
b6ecf2aa-ca1e-4a1f-9ac9-b198ae95c6b2	2026-02-03 17:52:07.236191	2026-02-03 17:52:07.236191	27786004-478a-40f8-bbce-7ab670a8401f	5	09:00:00	17:00:00	30	t
a90129ea-cfbf-4fed-953f-431fb42598c3	2026-02-03 17:53:59.910292	2026-02-03 17:53:59.910292	1bad63fb-b9f3-4bed-aeb5-c37d8656c5bc	0	09:01:00	18:00:00	30	t
\.


--
-- Data for Name: doctor_leaves; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.doctor_leaves (id, created_at, updated_at, doctor_id, start_date, end_date, reason) FROM stdin;
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.doctors (id, created_at, updated_at, user_id, name, email, phone, photo, qualification, specialization, department_id, experience, consultation_fee, bio, is_active) FROM stdin;
371e3673-8e46-4bf0-b164-f4f463b194f8	2026-02-02 20:31:50.706549	2026-02-02 20:31:50.706549	\N	Dr. Bikash Sharma	bikash.sharma@omchabahildental.com.np	+977 9841-234567	\N	BDS, NMC Registered	General Dentistry	fd147cf6-7398-4576-9260-adc44144a5e7	12	500.00	Expert in general dental care, preventive dentistry, and restorative treatments.	t
236ea465-f58d-44e2-9662-7ffc4b6ed9fa	2026-02-02 20:31:50.712408	2026-02-02 20:31:50.712408	\N	Dr. Sunita Thapa	sunita.thapa@omchabahildental.com.np	+977 9841-234568	\N	BDS, MDS (Orthodontics)	Orthodontics	c18471ff-2005-4944-afa3-29ff48ecd011	8	800.00	Specialist in braces, aligners, and teeth alignment treatments.	t
8a8908ff-5dc0-4571-9564-cc22e8cc2b39	2026-02-02 20:31:50.715714	2026-02-02 20:31:50.715714	\N	Dr. Ram Prasad KC	ram.kc@omchabahildental.com.np	+977 9841-234569	\N	BDS, MDS (OMFS)	Oral Surgery	0cb44c26-127f-4e4a-b8d9-2c93af561d40	15	1000.00	Experienced oral surgeon specializing in extractions, implants, and jaw surgeries.	t
4ba6ad18-9867-4170-b595-57aea22234b4	2026-02-02 20:31:50.719258	2026-02-02 20:31:50.719258	\N	Dr. Anita Gurung	anita.gurung@omchabahildental.com.np	+977 9841-234570	\N	BDS, MDS (Endodontics)	Endodontics	e67f6a85-f397-4aaa-895b-c03608b41ae8	10	700.00	Root canal specialist with expertise in saving damaged teeth.	t
ccb0a0b6-aa76-487a-9fc2-9bad18316a26	2026-02-02 20:31:50.722844	2026-02-02 20:31:50.722844	\N	Dr. Suman Adhikari	suman.adhikari@omchabahildental.com.np	+977 9841-234571	\N	BDS, MDS (Prostho)	Prosthodontics	0c50529e-cc42-4349-9460-d9718499faca	9	600.00	Expert in dental crowns, bridges, dentures, and smile makeovers.	t
c92603e3-bb3d-4372-a334-712b0d07def2	2026-02-02 20:31:50.72589	2026-02-02 20:31:50.72589	\N	Dr. Priya Shrestha	priya.shrestha@omchabahildental.com.np	+977 9841-234572	\N	BDS, MDS (Pedo)	Pediatric Dentistry	1cf415be-42ee-4f61-952e-8a664f260710	7	550.00	Child-friendly dentist specializing in dental care for kids and adolescents.	t
25bfd927-3f94-468d-96cd-1e9a898ef986	2026-02-02 20:31:50.728661	2026-02-02 20:31:50.728661	\N	Dr. Rajesh Maharjan	rajesh.maharjan@omchabahildental.com.np	+977 9841-234573	\N	BDS, MDS (Perio)	Periodontics	616df675-8aa6-4c76-bf8a-8a967a7e72cd	11	900.00	Gum specialist treating gum diseases and performing dental implants.	t
77c31f8b-f244-41c9-9796-41ece521de78	2026-02-02 20:31:50.731251	2026-02-02 20:31:50.731251	\N	Dr. Maya Tamang	maya.tamang@omchabahildental.com.np	+977 9841-234574	\N	BDS, Certified Cosmetic Dentist	Cosmetic Dentistry	fd147cf6-7398-4576-9260-adc44144a5e7	6	750.00	Specializing in teeth whitening, veneers, and smile enhancement procedures.	t
50319dd2-363f-45c6-8848-d68f747bfba8	2026-02-02 16:23:58.182256	2026-02-02 23:44:02.587089	\N	dhiraj	dhiraj22003@gmail.com	9886876899009	\N	BDD	Orthodontics	0cb44c26-127f-4e4a-b8d9-2c93af561d40	2	500.00	neck	t
78a4c98f-d693-49da-9c16-130b193de351	2026-02-03 00:15:36.090615	2026-02-03 00:15:57.306449	\N	llliuhiugu	hhvhh@jj.uyu	9876546788	\N	hv	Oral Surgery	0c50529e-cc42-4349-9460-d9718499faca	2	0.00	fghjk	t
27786004-478a-40f8-bbce-7ab670a8401f	2026-02-03 17:51:51.305433	2026-02-03 17:52:09.478505	\N	loio	asdfg@sd.kkj	3456787658	\N	fdgvh	Oral Surgery	0c50529e-cc42-4349-9460-d9718499faca	4	0.00	rsdtfygjhkn	t
1bad63fb-b9f3-4bed-aeb5-c37d8656c5bc	2026-02-03 17:53:42.080405	2026-02-03 17:54:01.481368	\N	pooppp	ppoppp@pp.popp	1234567890	\N	popppooo	Periodontics	0c50529e-cc42-4349-9460-d9718499faca	9	1000.00	pppoppoppo	t
\.


--
-- Data for Name: enquiries; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.enquiries (id, created_at, updated_at, type, name, email, phone, subject, message, status, assigned_to, response, responded_at) FROM stdin;
74d3dde2-c71a-4790-92f2-8f192857efdb	2026-01-31 20:37:05.686707	2026-01-31 20:37:05.686707	appointment	Rajesh Kumar	rajesh.kumar@example.com	+977 9841-123456	Need to book an appointment for dental checkup	I would like to schedule a dental checkup appointment. Please let me know the available slots for next week.	new	\N	\N	\N
091573e9-f863-4609-bb79-5c053901f456	2026-01-28 20:37:05.686707	2026-02-01 20:37:05.686707	services	Sita Devi	sita.devi@example.com	+977 9841-234567	Inquiry about orthodontic treatment	I am interested in getting braces. Can you please provide information about the treatment options and costs?	in_progress	\N	\N	\N
ca08654f-0099-4130-bfca-b19bd9481ce7	2026-02-01 20:37:05.686707	2026-02-01 20:37:05.686707	admission	Amit Shrestha	amit.shrestha@example.com	+977 9841-345678	BDS Admission Query	I want to apply for BDS program. What are the admission requirements and when is the application deadline?	new	\N	\N	\N
302b357a-a1b9-4c49-ac3b-670da3101100	2026-01-26 20:37:05.686707	2026-01-30 20:37:05.686707	general	Maya Thapa	maya.thapa@example.com	+977 9841-456789	Clinic timings and location	What are your clinic hours? And can you provide directions to your clinic?	resolved	\N	\N	\N
fc05a82a-9673-44e8-b02e-63a01bdfb282	2026-01-23 20:37:05.686707	2026-01-25 20:37:05.686707	feedback	Hari Prasad	hari.prasad@example.com	+977 9841-567890	Excellent service	I had a great experience at your clinic. The staff was very professional and the treatment was excellent. Thank you!	closed	\N	\N	\N
86a6bea0-a6c0-493e-83c4-fd4fbec00a30	2026-01-30 20:37:05.686707	2026-02-01 20:37:05.686707	complaint	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-678901	Long waiting time	I had to wait for more than an hour for my appointment. This is unacceptable.	in_progress	\N	\N	\N
41e4c0fc-3993-4798-8c5a-dbd3e6a6635a	2026-02-02 14:37:05.686707	2026-02-02 14:37:05.686707	appointment	Sunita Gurung	sunita.gurung@example.com	+977 9841-789012	Emergency dental appointment	I have severe tooth pain and need an emergency appointment as soon as possible.	new	\N	\N	\N
12c54c80-199e-4850-9b75-24b3ad22a824	2026-01-29 20:37:05.686707	2026-01-31 20:37:05.686707	services	Ram KC	ram.kc@example.com	+977 9841-890123	Root canal treatment cost	Can you please provide information about root canal treatment costs and procedure?	resolved	\N	\N	\N
5a345d47-aa72-42a1-a26e-264fdc091c16	2026-02-02 08:37:05.686707	2026-02-02 08:37:05.686707	admission	Priya Shrestha	priya.shrestha@example.com	+977 9841-901234	MDS Admission Requirements	I am interested in MDS Orthodontics program. What are the eligibility criteria?	new	\N	\N	\N
f342984c-c168-4ce6-a08f-45e457934746	2026-01-31 20:37:05.686707	2026-02-01 20:37:05.686707	general	Anjali Tamang	anjali.tamang@example.com	+977 9841-012345	Insurance coverage	Do you accept health insurance? Which insurance providers do you work with?	in_progress	\N	\N	\N
0049559b-3b23-40e7-acfc-596f9b0e459c	2026-01-31 20:37:43.140072	2026-01-31 20:37:43.140072	appointment	Rajesh Kumar	rajesh.kumar@example.com	+977 9841-123456	Need to book an appointment for dental checkup	I would like to schedule a dental checkup appointment. Please let me know the available slots for next week.	new	\N	\N	\N
37ba122d-a2d9-4bf0-be44-433496d330ab	2026-01-28 20:37:43.140072	2026-02-01 20:37:43.140072	services	Sita Devi	sita.devi@example.com	+977 9841-234567	Inquiry about orthodontic treatment	I am interested in getting braces. Can you please provide information about the treatment options and costs?	in_progress	\N	\N	\N
1c332066-c4c6-4d9a-8a5d-86b5969b12b0	2026-02-01 20:37:43.140072	2026-02-01 20:37:43.140072	admission	Amit Shrestha	amit.shrestha@example.com	+977 9841-345678	BDS Admission Query	I want to apply for BDS program. What are the admission requirements and when is the application deadline?	new	\N	\N	\N
92c4d7ac-5e38-4b3d-8ee3-2f7cd33a9e08	2026-01-26 20:37:43.140072	2026-01-30 20:37:43.140072	general	Maya Thapa	maya.thapa@example.com	+977 9841-456789	Clinic timings and location	What are your clinic hours? And can you provide directions to your clinic?	resolved	\N	\N	\N
e1b0eae8-6d98-4862-9c49-e99bb9ce9717	2026-01-23 20:37:43.140072	2026-01-25 20:37:43.140072	feedback	Hari Prasad	hari.prasad@example.com	+977 9841-567890	Excellent service	I had a great experience at your clinic. The staff was very professional and the treatment was excellent. Thank you!	closed	\N	\N	\N
0eea73f1-5531-44b3-a47f-1b7339f6886e	2026-01-30 20:37:43.140072	2026-02-01 20:37:43.140072	complaint	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-678901	Long waiting time	I had to wait for more than an hour for my appointment. This is unacceptable.	in_progress	\N	\N	\N
42213c67-2dc3-4d3e-b481-5a2d2c745279	2026-02-02 14:37:43.140072	2026-02-02 14:37:43.140072	appointment	Sunita Gurung	sunita.gurung@example.com	+977 9841-789012	Emergency dental appointment	I have severe tooth pain and need an emergency appointment as soon as possible.	new	\N	\N	\N
92596e2d-1178-41b1-a880-7d8b98e93004	2026-01-29 20:37:43.140072	2026-01-31 20:37:43.140072	services	Ram KC	ram.kc@example.com	+977 9841-890123	Root canal treatment cost	Can you please provide information about root canal treatment costs and procedure?	resolved	\N	\N	\N
ee8a9e91-2e6b-4e39-884e-bc7fe6dfe190	2026-02-02 08:37:43.140072	2026-02-02 08:37:43.140072	admission	Priya Shrestha	priya.shrestha@example.com	+977 9841-901234	MDS Admission Requirements	I am interested in MDS Orthodontics program. What are the eligibility criteria?	new	\N	\N	\N
76cc710a-49f2-43e8-92f3-94dcf8e1b6b9	2026-01-31 20:37:43.140072	2026-02-01 20:37:43.140072	general	Anjali Tamang	anjali.tamang@example.com	+977 9841-012345	Insurance coverage	Do you accept health insurance? Which insurance providers do you work with?	in_progress	\N	\N	\N
788e80ce-d5a7-4f5c-93ad-8d3a23b07a9a	2026-01-31 20:38:12.502413	2026-01-31 20:38:12.502413	appointment	Rajesh Kumar	rajesh.kumar@example.com	+977 9841-123456	Need to book an appointment for dental checkup	I would like to schedule a dental checkup appointment. Please let me know the available slots for next week.	new	\N	\N	\N
6bfb0218-4e7c-49ff-a8b6-c49330bb76ca	2026-01-28 20:38:12.502413	2026-02-01 20:38:12.502413	services	Sita Devi	sita.devi@example.com	+977 9841-234567	Inquiry about orthodontic treatment	I am interested in getting braces. Can you please provide information about the treatment options and costs?	in_progress	\N	\N	\N
07a3cea8-5b59-4661-be65-bfeb37c2e389	2026-02-01 20:38:12.502413	2026-02-01 20:38:12.502413	admission	Amit Shrestha	amit.shrestha@example.com	+977 9841-345678	BDS Admission Query	I want to apply for BDS program. What are the admission requirements and when is the application deadline?	new	\N	\N	\N
f10421d0-43f0-4c6f-b0f5-ace01dd6038a	2026-01-26 20:38:12.502413	2026-01-30 20:38:12.502413	general	Maya Thapa	maya.thapa@example.com	+977 9841-456789	Clinic timings and location	What are your clinic hours? And can you provide directions to your clinic?	resolved	\N	\N	\N
6246a743-ce5c-471a-8117-79435af8f0d3	2026-01-23 20:38:12.502413	2026-01-25 20:38:12.502413	feedback	Hari Prasad	hari.prasad@example.com	+977 9841-567890	Excellent service	I had a great experience at your clinic. The staff was very professional and the treatment was excellent. Thank you!	closed	\N	\N	\N
cf6872ab-cb23-4537-82bf-cdbdbdc0ab78	2026-01-30 20:38:12.502413	2026-02-01 20:38:12.502413	complaint	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-678901	Long waiting time	I had to wait for more than an hour for my appointment. This is unacceptable.	in_progress	\N	\N	\N
8a5dac6d-c4bd-4475-ab9c-cc30f30dbce0	2026-02-02 14:38:12.502413	2026-02-02 14:38:12.502413	appointment	Sunita Gurung	sunita.gurung@example.com	+977 9841-789012	Emergency dental appointment	I have severe tooth pain and need an emergency appointment as soon as possible.	new	\N	\N	\N
d8f004d9-1000-46b6-a6cb-493441f3b0d2	2026-01-29 20:38:12.502413	2026-01-31 20:38:12.502413	services	Ram KC	ram.kc@example.com	+977 9841-890123	Root canal treatment cost	Can you please provide information about root canal treatment costs and procedure?	resolved	\N	\N	\N
0d207396-af39-4f33-92e1-6138bf5391b9	2026-02-02 08:38:12.502413	2026-02-02 08:38:12.502413	admission	Priya Shrestha	priya.shrestha@example.com	+977 9841-901234	MDS Admission Requirements	I am interested in MDS Orthodontics program. What are the eligibility criteria?	new	\N	\N	\N
a5351688-96b8-4cf1-8044-a42147e9db22	2026-01-31 20:38:12.502413	2026-02-01 20:38:12.502413	general	Anjali Tamang	anjali.tamang@example.com	+977 9841-012345	Insurance coverage	Do you accept health insurance? Which insurance providers do you work with?	in_progress	\N	\N	\N
f2b8cda5-b3a5-45b6-b0d0-f4f451053a7f	2026-01-31 20:38:34.949055	2026-01-31 20:38:34.949055	appointment	Rajesh Kumar	rajesh.kumar@example.com	+977 9841-123456	Need to book an appointment for dental checkup	I would like to schedule a dental checkup appointment. Please let me know the available slots for next week.	new	\N	\N	\N
395e5946-e7bc-455b-9918-02e33eb902f4	2026-01-28 20:38:34.949055	2026-02-01 20:38:34.949055	services	Sita Devi	sita.devi@example.com	+977 9841-234567	Inquiry about orthodontic treatment	I am interested in getting braces. Can you please provide information about the treatment options and costs?	in_progress	\N	\N	\N
0b969b79-7146-4d30-8705-0ef28426e7d8	2026-02-01 20:38:34.949055	2026-02-01 20:38:34.949055	admission	Amit Shrestha	amit.shrestha@example.com	+977 9841-345678	BDS Admission Query	I want to apply for BDS program. What are the admission requirements and when is the application deadline?	new	\N	\N	\N
b4d8aca8-e215-42cb-a517-ecaf9f0ef91c	2026-01-26 20:38:34.949055	2026-01-30 20:38:34.949055	general	Maya Thapa	maya.thapa@example.com	+977 9841-456789	Clinic timings and location	What are your clinic hours? And can you provide directions to your clinic?	resolved	\N	\N	\N
a2d67117-ff92-432d-b671-7f81f7338bd7	2026-01-23 20:38:34.949055	2026-01-25 20:38:34.949055	feedback	Hari Prasad	hari.prasad@example.com	+977 9841-567890	Excellent service	I had a great experience at your clinic. The staff was very professional and the treatment was excellent. Thank you!	closed	\N	\N	\N
61a256e9-ee5c-4d66-957c-53ff1eff79f3	2026-01-30 20:38:34.949055	2026-02-01 20:38:34.949055	complaint	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-678901	Long waiting time	I had to wait for more than an hour for my appointment. This is unacceptable.	in_progress	\N	\N	\N
880e250b-1b19-4e49-bc5d-22981b948d3e	2026-02-02 14:38:34.949055	2026-02-02 14:38:34.949055	appointment	Sunita Gurung	sunita.gurung@example.com	+977 9841-789012	Emergency dental appointment	I have severe tooth pain and need an emergency appointment as soon as possible.	new	\N	\N	\N
48b9352b-3a6f-41ec-bad8-ef2968119b88	2026-01-29 20:38:34.949055	2026-01-31 20:38:34.949055	services	Ram KC	ram.kc@example.com	+977 9841-890123	Root canal treatment cost	Can you please provide information about root canal treatment costs and procedure?	resolved	\N	\N	\N
d86d8cad-0325-47bf-b1e5-3c6494b6cdc6	2026-02-02 08:38:34.949055	2026-02-02 08:38:34.949055	admission	Priya Shrestha	priya.shrestha@example.com	+977 9841-901234	MDS Admission Requirements	I am interested in MDS Orthodontics program. What are the eligibility criteria?	new	\N	\N	\N
4f7d04bb-ef91-4f0b-9cd9-11573e155e40	2026-01-31 20:38:34.949055	2026-02-01 20:38:34.949055	general	Anjali Tamang	anjali.tamang@example.com	+977 9841-012345	Insurance coverage	Do you accept health insurance? Which insurance providers do you work with?	in_progress	\N	\N	\N
5d2197a0-bad4-42e3-9653-bd27aaa85594	2026-01-31 21:03:43.335707	2026-01-31 21:03:43.335707	appointment	Rajesh Kumar	rajesh.kumar@example.com	+977 9841-123456	Need to book an appointment for dental checkup	I would like to schedule a dental checkup appointment. Please let me know the available slots for next week.	new	\N	\N	\N
4442f297-e9e8-413c-a54d-3dd90a75b4ad	2026-01-28 21:03:43.335707	2026-02-01 21:03:43.335707	services	Sita Devi	sita.devi@example.com	+977 9841-234567	Inquiry about orthodontic treatment	I am interested in getting braces. Can you please provide information about the treatment options and costs?	in_progress	\N	\N	\N
53c10968-b8a4-4e1f-91ed-6344d693c0a6	2026-02-01 21:03:43.335707	2026-02-01 21:03:43.335707	admission	Amit Shrestha	amit.shrestha@example.com	+977 9841-345678	BDS Admission Query	I want to apply for BDS program. What are the admission requirements and when is the application deadline?	new	\N	\N	\N
1bc6773b-7f3a-4610-aa54-c013f112b924	2026-01-26 21:03:43.335707	2026-01-30 21:03:43.335707	general	Maya Thapa	maya.thapa@example.com	+977 9841-456789	Clinic timings and location	What are your clinic hours? And can you provide directions to your clinic?	resolved	\N	\N	\N
56d129ea-48e8-4a05-bde1-ac5bf06c3f7c	2026-01-23 21:03:43.335707	2026-01-25 21:03:43.335707	feedback	Hari Prasad	hari.prasad@example.com	+977 9841-567890	Excellent service	I had a great experience at your clinic. The staff was very professional and the treatment was excellent. Thank you!	closed	\N	\N	\N
ec4d9181-69d0-493f-a18e-17388bdf41ef	2026-01-30 21:03:43.335707	2026-02-01 21:03:43.335707	complaint	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-678901	Long waiting time	I had to wait for more than an hour for my appointment. This is unacceptable.	in_progress	\N	\N	\N
6a3044c3-9593-4f09-8716-a2a3c4c41d61	2026-02-02 15:03:43.335707	2026-02-02 15:03:43.335707	appointment	Sunita Gurung	sunita.gurung@example.com	+977 9841-789012	Emergency dental appointment	I have severe tooth pain and need an emergency appointment as soon as possible.	new	\N	\N	\N
f2b18c02-4d4d-4775-bfdd-5cc9b9d56726	2026-01-29 21:03:43.335707	2026-01-31 21:03:43.335707	services	Ram KC	ram.kc@example.com	+977 9841-890123	Root canal treatment cost	Can you please provide information about root canal treatment costs and procedure?	resolved	\N	\N	\N
5c674da0-c019-44d7-8bfd-ff2838b7e71f	2026-02-02 09:03:43.335707	2026-02-02 09:03:43.335707	admission	Priya Shrestha	priya.shrestha@example.com	+977 9841-901234	MDS Admission Requirements	I am interested in MDS Orthodontics program. What are the eligibility criteria?	new	\N	\N	\N
3d9e192b-a79d-42a7-9d74-2631a3cc3bf0	2026-01-31 21:03:43.335707	2026-02-01 21:03:43.335707	general	Anjali Tamang	anjali.tamang@example.com	+977 9841-012345	Insurance coverage	Do you accept health insurance? Which insurance providers do you work with?	in_progress	\N	\N	\N
d2945bab-fe7a-47d9-a61b-98ef22a57221	2026-02-01 17:46:45.126826	2026-02-01 17:46:45.126826	appointment	Rajesh Kumar	rajesh.kumar@example.com	+977 9841-123456	Need to book an appointment for dental checkup	I would like to schedule a dental checkup appointment. Please let me know the available slots for next week.	new	\N	\N	\N
8343d10a-dbf6-463c-90a8-4336abb46247	2026-01-29 17:46:45.126826	2026-02-02 17:46:45.126826	services	Sita Devi	sita.devi@example.com	+977 9841-234567	Inquiry about orthodontic treatment	I am interested in getting braces. Can you please provide information about the treatment options and costs?	in_progress	\N	\N	\N
d99cda95-b72b-4484-a08c-0fd636fd92af	2026-02-02 17:46:45.126826	2026-02-02 17:46:45.126826	admission	Amit Shrestha	amit.shrestha@example.com	+977 9841-345678	BDS Admission Query	I want to apply for BDS program. What are the admission requirements and when is the application deadline?	new	\N	\N	\N
baecf8f5-c2a1-40f3-abc8-11c51c2b5893	2026-01-27 17:46:45.126826	2026-01-31 17:46:45.126826	general	Maya Thapa	maya.thapa@example.com	+977 9841-456789	Clinic timings and location	What are your clinic hours? And can you provide directions to your clinic?	resolved	\N	\N	\N
72b53fc0-3e41-4d28-a4c2-107a1f0c67cd	2026-01-24 17:46:45.126826	2026-01-26 17:46:45.126826	feedback	Hari Prasad	hari.prasad@example.com	+977 9841-567890	Excellent service	I had a great experience at your clinic. The staff was very professional and the treatment was excellent. Thank you!	closed	\N	\N	\N
7c2425db-901a-4ca8-abd0-aceea4393fff	2026-01-31 17:46:45.126826	2026-02-02 17:46:45.126826	complaint	Bikash Maharjan	bikash.maharjan@example.com	+977 9841-678901	Long waiting time	I had to wait for more than an hour for my appointment. This is unacceptable.	in_progress	\N	\N	\N
234c3cd7-0c02-442a-95a4-ebb6df9f3339	2026-02-03 11:46:45.126826	2026-02-03 11:46:45.126826	appointment	Sunita Gurung	sunita.gurung@example.com	+977 9841-789012	Emergency dental appointment	I have severe tooth pain and need an emergency appointment as soon as possible.	new	\N	\N	\N
705cb06f-07fa-4e64-9835-a87560da6524	2026-01-30 17:46:45.126826	2026-02-01 17:46:45.126826	services	Ram KC	ram.kc@example.com	+977 9841-890123	Root canal treatment cost	Can you please provide information about root canal treatment costs and procedure?	resolved	\N	\N	\N
ad5ca723-201b-47db-96a5-55732e607947	2026-02-03 05:46:45.126826	2026-02-03 05:46:45.126826	admission	Priya Shrestha	priya.shrestha@example.com	+977 9841-901234	MDS Admission Requirements	I am interested in MDS Orthodontics program. What are the eligibility criteria?	new	\N	\N	\N
b295fb0b-50c5-42cc-8a4b-b9b2e7d501d6	2026-02-01 17:46:45.126826	2026-02-02 17:46:45.126826	general	Anjali Tamang	anjali.tamang@example.com	+977 9841-012345	Insurance coverage	Do you accept health insurance? Which insurance providers do you work with?	in_progress	\N	\N	\N
\.


--
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.faculty (id, created_at, updated_at, name, designation, qualification, department_id, photo, email, specialization, bio, publications, is_active, "order") FROM stdin;
\.


--
-- Data for Name: media_files; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.media_files (id, created_at, updated_at, name, url, public_id, type, mime_type, size, width, height, folder, alt, caption) FROM stdin;
4629c4aa-57e6-4016-bf02-fd6d2c6dfe7d	2026-02-03 20:09:59.894228	2026-02-03 20:09:59.894228	d.jpeg	/images/d.jpeg	d.jpeg	image	image/jpeg	214109	\N	\N	treatments	\N	\N
073955c2-247d-4d19-88bb-e2950a27c8b2	2026-02-03 20:09:59.90871	2026-02-03 20:09:59.90871	dds.jpeg	/images/dds.jpeg	dds.jpeg	image	image/jpeg	116898	\N	\N	treatments	\N	\N
07a061ea-a7fa-4b24-88c5-7470c54040b1	2026-02-03 20:09:59.916312	2026-02-03 20:09:59.916312	dfdf.jpeg	/images/dfdf.jpeg	dfdf.jpeg	image	image/jpeg	168446	\N	\N	treatments	\N	\N
6e2d3291-0183-4c8c-8b1f-dee45ba674ce	2026-02-03 20:09:59.922237	2026-02-03 20:09:59.922237	jkj.jpeg	/images/jkj.jpeg	jkj.jpeg	image	image/jpeg	114592	\N	\N	treatments	\N	\N
67a63a71-7d63-47ea-a615-dcc13ca49326	2026-02-03 20:09:59.929387	2026-02-03 20:09:59.929387	kjbj.jpeg	/images/kjbj.jpeg	kjbj.jpeg	image	image/jpeg	55534	\N	\N	treatments	\N	\N
92d53d07-d988-4266-8918-4acd732de11c	2026-02-03 20:09:59.935498	2026-02-03 20:09:59.935498	logo.jpeg	/images/logo.jpeg	logo.jpeg	image	image/jpeg	55686	\N	\N	treatments	\N	\N
e49f1db1-5c68-40e5-addf-55233a10c47b	2026-02-03 20:09:59.941705	2026-02-03 20:09:59.941705	sds.jpeg	/images/sds.jpeg	sds.jpeg	image	image/jpeg	102899	\N	\N	treatments	\N	\N
a1aafc0b-35ba-43ec-8708-15cc80f27ba0	2026-02-03 20:09:59.948312	2026-02-03 20:09:59.948312	WhatsApp Image 2026-02-01 at 6.11.10 PM.jpeg	/images/WhatsApp Image 2026-02-01 at 6.11.10 PM.jpeg	WhatsApp Image 2026-02-01 at 6.11.10 PM.jpeg	image	image/jpeg	153690	\N	\N	treatments	\N	\N
8ab21610-0f52-4838-b8a0-44458ea223af	2026-02-03 20:09:59.954365	2026-02-03 20:09:59.954365	WhatsApp Image 2026-02-01 at 6.11.10 PMdsd.jpeg	/images/WhatsApp Image 2026-02-01 at 6.11.10 PMdsd.jpeg	WhatsApp Image 2026-02-01 at 6.11.10 PMdsd.jpeg	image	image/jpeg	222391	\N	\N	treatments	\N	\N
9be92d27-ef61-4424-bd49-db26758a3627	2026-02-03 20:09:59.961815	2026-02-03 20:09:59.961815	WhatsApp Image 2026-02-01 at 6.37.53 PM.jpeg	/images/WhatsApp Image 2026-02-01 at 6.37.53 PM.jpeg	WhatsApp Image 2026-02-01 at 6.37.53 PM.jpeg	image	image/jpeg	189311	\N	\N	treatments	\N	\N
a529ca6c-5b51-400a-a3e7-807b5bf97bf1	2026-02-03 20:09:59.968908	2026-02-03 20:09:59.968908	WhatsApp Image2 2026-02-01 at 6.11.10 PM.jpeg	/images/WhatsApp Image2 2026-02-01 at 6.11.10 PM.jpeg	WhatsApp Image2 2026-02-01 at 6.11.10 PM.jpeg	image	image/jpeg	324209	\N	\N	treatments	\N	\N
97383dcb-36f4-49c2-bd5c-04379f997731	2026-02-03 20:09:59.985617	2026-02-03 20:09:59.985617	dffd.mp4	/video/dffd.mp4	dffd.mp4	video	video/mp4	15083310	\N	\N	treatments	\N	\N
a2c2d34b-8e37-43cb-aa1f-1d83c7c57595	2026-02-03 20:09:59.994501	2026-02-03 20:09:59.994501	se.mp4	/video/se.mp4	se.mp4	video	video/mp4	2844697	\N	\N	treatments	\N	\N
f1ef9dae-4c7e-46e0-af2e-6c1c7e6fbdfa	2026-02-03 20:10:00.002885	2026-02-03 20:10:00.002885	WhatsApp Video 2026-02-01 at 6.37.35 PM.mp4	/video/WhatsApp Video 2026-02-01 at 6.37.35 PM.mp4	WhatsApp Video 2026-02-01 at 6.37.35 PM.mp4	video	video/mp4	4433484	\N	\N	treatments	\N	\N
abe80526-0280-411e-ab05-6a839e22b9d7	2026-02-03 20:10:00.010521	2026-02-03 20:10:00.010521	WhatsApp Video 2026-02-01 at 6.37.36 PM.mp4	/video/WhatsApp Video 2026-02-01 at 6.37.36 PM.mp4	WhatsApp Video 2026-02-01 at 6.37.36 PM.mp4	video	video/mp4	1755982	\N	\N	treatments	\N	\N
c94c182a-4261-459a-8205-e9bdcaf7c386	2026-02-03 20:10:00.018381	2026-02-03 20:10:00.018381	WhatsApp Video 2026-02-01 at 6.37.49 PM.mp4	/video/WhatsApp Video 2026-02-01 at 6.37.49 PM.mp4	WhatsApp Video 2026-02-01 at 6.37.49 PM.mp4	video	video/mp4	2899455	\N	\N	treatments	\N	\N
3e0f8409-5975-4cbc-8176-d4ca01a301d2	2026-02-03 20:10:00.027617	2026-02-03 20:10:00.027617	WhatsApp Video 2026-02-01 at 6.37.50 PM.mp4	/video/WhatsApp Video 2026-02-01 at 6.37.50 PM.mp4	WhatsApp Video 2026-02-01 at 6.37.50 PM.mp4	video	video/mp4	3292656	\N	\N	treatments	\N	\N
0f6d6711-4982-467e-9bae-0c8ba10a9857	2026-02-03 20:10:00.036038	2026-02-03 20:10:00.036038	WhatsApp Video 2026-02-01 at 6.38.31 PM.mp4	/video/WhatsApp Video 2026-02-01 at 6.38.31 PM.mp4	WhatsApp Video 2026-02-01 at 6.38.31 PM.mp4	video	video/mp4	4334610	\N	\N	treatments	\N	\N
5b4dd6f3-be94-4e2a-b467-27830aa5d33b	2026-02-03 20:10:00.049218	2026-02-03 20:10:00.049218	WhatsApp Video 2026-02-01 at 6.38.33 PM.mp4	/video/WhatsApp Video 2026-02-01 at 6.38.33 PM.mp4	WhatsApp Video 2026-02-01 at 6.38.33 PM.mp4	video	video/mp4	10172787	\N	\N	treatments	\N	\N
\.


--
-- Data for Name: page_content; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.page_content (id, created_at, updated_at, page_slug, section_key, content, seo) FROM stdin;
51c7b565-5082-4d1f-ad06-63bef7d23cbf	2026-02-02 20:24:43.527903	2026-02-02 20:24:43.527903	home	hero	{"stats": {"happyPatients": "5000+", "expertDentists": "15+", "yearsExperience": "10+"}, "title": "Your Smile, Our Priority", "subtitle": "Om Chabahil Dental Hospital - Providing quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.", "badgeText": "Open 7 Days a Week - Quality Dental Care", "highlightText": "Our Priority", "primaryCtaText": "Book Appointment", "secondaryCtaText": "Call Now"}	{"title": "Om Chabahil Dental Hospital | Quality Dental Care in Kathmandu", "keywords": ["dental hospital", "Om Chabahil Dental", "dentist Kathmandu"], "description": "Om Chabahil Dental Hospital provides quality dental care with modern technology and experienced professionals in Kathmandu, Nepal."}
a7460f6d-7815-471a-bb44-5209ac508d32	2026-02-02 20:24:43.532559	2026-02-02 20:24:43.532559	home	about	{"title": "Your Trusted Dental Care Partner", "features": ["Modern dental equipment and sterilization", "Experienced and certified dentists", "Comfortable and hygienic environment", "Affordable treatment options", "Emergency dental services available", "Personalized patient care"], "badgeLabel": "About Us", "paragraph1": "Om Chabahil Dental Hospital has been serving the Kathmandu community with quality dental care services. Our clinic in Koteshwor is equipped with modern technology and staffed by experienced dental professionals.", "paragraph2": "We believe in providing personalized care to each patient, ensuring comfort and satisfaction. From routine check-ups to complex dental procedures, we offer comprehensive dental services for the whole family.", "experienceYears": "10+"}	\N
42863605-2cab-4736-86f7-7a6176bbbb93	2026-02-02 20:24:43.535401	2026-02-02 20:24:43.535401	home	services	{"title": "Comprehensive Dental Care", "subtitle": "From routine checkups to advanced procedures, we offer a full range of dental services to meet all your oral health needs.", "badgeLabel": "Our Services"}	\N
5b89f2b9-677c-4e2f-ad02-692ed9ad07fe	2026-02-02 20:24:43.539107	2026-02-02 20:24:43.539107	home	stats	{"items": [{"label": "Graduates", "value": 5000, "suffix": "+", "description": "Successful dental professionals"}, {"label": "Expert Faculty", "value": 50, "suffix": "+", "description": "Experienced specialists"}, {"label": "Happy Patients", "value": 100000, "suffix": "+", "description": "Treated successfully"}, {"label": "Years", "value": 25, "suffix": "+", "description": "Of excellence"}], "heading": "Numbers That Speak for Themselves", "subtitle": "Our track record of success in dental education and patient care"}	\N
dd1a0a6c-eed3-4f3e-9f5c-419297ac3eac	2026-02-02 20:24:43.54185	2026-02-02 20:24:43.54185	home	contact	{"email": "info@omchabahildental.com.np", "phone": "+977 01-4812345", "title": "Get in Touch", "address": "Chabahil, Kathmandu, Nepal", "subtitle": "We're Here to Help", "whatsapp": "+977 9841234567", "workingHours": "Mon-Fri: 9AM-6PM, Sat: 9AM-4PM"}	\N
9d047483-bc2a-4334-8ad2-e9fe4ea5f064	2026-02-02 20:24:43.543863	2026-02-02 20:24:43.543863	home	doctors	{"title": "Meet Our Expert Dentists", "subtitle": "Our team of experienced and qualified dental professionals is dedicated to providing you with the best possible care.", "badgeLabel": "Our Team"}	\N
c5c8b695-ddda-46dd-9af2-35f7d85eda75	2026-02-02 20:24:43.546573	2026-02-02 20:24:43.546573	home	testimonials	{"title": "What Our Patients & Students Say", "subtitle": "Hear from those who have experienced our care and education firsthand.", "badgeLabel": "Testimonials"}	\N
d6e194ed-b0ec-4674-b4a6-0dd13be2a369	2026-02-02 20:24:43.549001	2026-02-02 20:24:43.549001	home	blog	{"title": "Dental Knowledge Hub", "subtitle": "Stay informed with the latest dental health tips, news, and educational content from our experts.", "badgeLabel": "Blog & News"}	\N
eb8f7e64-d00c-43db-ab89-1994cab0779a	2026-02-02 20:24:43.551827	2026-02-02 20:24:43.551827	home	cta	{"title": "Ready to Start Your Dental Journey?", "subtitle": "Whether you're looking for quality dental care or pursuing a career in dentistry, we're here to help you every step of the way.", "contactCards": {"hours": {"saturday": "Saturday: 8:00 AM - 5:00 PM", "weekdays": "Sunday - Friday: 7:00 AM - 7:00 PM"}, "phone": {"label": "Call us anytime", "value": "+977 9841-234567"}, "location": {"label": "Visit us at", "value": "Chabahil, Koteshwor, Kathmandu, Nepal"}}, "highlightText": "Dental Journey?", "primaryCtaText": "Book Appointment", "secondaryCtaText": "Apply for Admission"}	\N
eff9ef1e-d7a8-44ec-a39e-076b16cde590	2026-02-02 20:24:43.554266	2026-02-02 20:24:43.554266	about	hero	{"title": "About Om Chabahil Dental Hospital", "subtitle": "Your trusted dental care partner in Kathmandu. Providing quality dental services with modern technology and experienced professionals."}	{"title": "About Us | Om Chabahil Dental Hospital", "keywords": ["about", "dental hospital", "Kathmandu", "dental care"], "description": "Learn about Om Chabahil Dental Hospital - Your trusted dental care partner in Kathmandu, Nepal. Quality dental services with modern technology."}
7c0a8249-f071-490c-a0b8-89c70818abd6	2026-02-02 20:24:43.556967	2026-02-02 20:24:43.556967	about	main	{"title": "Our Story", "address": "Chabahil, Koteshwor, Kathmandu, Nepal", "imagePath": "/images/team.jpg", "paragraph1": "Om Chabahil Dental Hospital was established with a vision to provide accessible, affordable, and quality dental care to the people of Kathmandu. Located in the heart of Koteshwor, we have been serving the community for over a decade.", "paragraph2": "Our clinic is equipped with modern dental equipment and follows international standards of sterilization and hygiene. We believe in providing personalized care to each patient, understanding their unique needs and concerns.", "paragraph3": "From routine dental check-ups to complex procedures like dental implants and orthodontic treatments, our experienced team is here to help you achieve and maintain a healthy, beautiful smile."}	\N
f30951bb-2513-4c20-a7dd-e50c95fa15ae	2026-02-02 20:24:43.559425	2026-02-02 20:24:43.559425	about	values	{"title": "Why Choose Us", "values": [{"title": "Quality Care", "description": "We maintain the highest standards in dental treatment and patient care."}, {"title": "Expert Team", "description": "Our experienced dentists and staff work together for your health."}, {"title": "Modern Technology", "description": "We use the latest dental equipment and techniques."}, {"title": "Patient First", "description": "Your comfort and satisfaction is our top priority."}], "subtitle": "We are committed to providing the best dental care experience."}	\N
8f2c70cb-f15c-4624-a0d9-0332b8076d60	2026-02-02 20:24:43.561694	2026-02-02 20:24:43.561694	about	services-overview	{"title": "Our Services", "services": ["General Dentistry & Check-ups", "Root Canal Treatment (RCT)", "Dental Implants", "Orthodontics (Braces)", "Cosmetic Dentistry", "Pediatric Dentistry", "Oral Surgery", "Teeth Whitening"], "imagePaths": ["/images/clinic-1.jpg", "/images/clinic-2.jpg", "/images/clinic-3.jpg", "/images/clinic-4.jpg"], "description": "We offer a comprehensive range of dental services to meet all your oral health needs. Our team is trained in the latest techniques and uses modern equipment for optimal results."}	\N
811fb0d8-4d3c-4552-b2f9-6f92e8ae445f	2026-02-02 20:24:43.564339	2026-02-02 20:24:43.564339	about	video	{"title": "Take a Virtual Tour", "subtitle": "Experience our clinic facilities from the comfort of your home.", "videoPath": "/videos/tour-1.mp4", "posterImage": "/images/clinic-1.jpg"}	\N
e4e3e63f-82ea-493d-b98f-53ec7d06f093	2026-02-02 20:24:43.566702	2026-02-02 20:24:43.566702	about	cta	{"phone": "+977 9841-234567", "title": "Ready to Visit Us?", "subtitle": "Book your appointment today and experience quality dental care at Om Chabahil Dental Hospital.", "primaryCtaText": "Book Appointment", "secondaryCtaText": "Call Now"}	\N
de784261-0f29-4fc3-8829-4e00fcebb44c	2026-02-02 20:24:43.569297	2026-02-02 20:24:43.569297	services	hero	{"title": "Our Dental Services", "subtitle": "Comprehensive dental care for the whole family, from routine checkups to advanced treatments, delivered with expertise and compassion."}	{"title": "Dental Services | Om Chabahil Dental Hospital", "keywords": ["dental services", "dentistry", "dental treatments", "Kathmandu"], "description": "Comprehensive dental services in Kathmandu including general dentistry, orthodontics, root canal, dental implants, cosmetic dentistry, and more."}
edb2c8ae-92aa-4f7d-bc98-6feb65f1f09e	2026-02-02 20:24:43.574515	2026-02-02 20:24:43.574515	services	cta	{"title": "Need Help Choosing a Treatment?", "subtitle": "Our experienced dental team is here to help you find the best treatment option for your needs. Schedule a consultation today.", "primaryCtaText": "Schedule Consultation", "secondaryCtaText": "Contact Us"}	\N
7c964e89-a82b-45b4-abeb-5ff628a6f0a2	2026-02-02 20:24:43.577359	2026-02-02 20:24:43.577359	doctors	hero	{"title": "Our Dental Team", "subtitle": "Meet our experienced team of dental professionals dedicated to providing you with the best possible care at Om Chabahil Dental Hospital."}	{"title": "Our Doctors | Om Chabahil Dental Hospital", "keywords": ["dentists", "dental team", "dental professionals", "Kathmandu"], "description": "Meet our experienced team of dental professionals dedicated to providing quality dental care."}
dfeebee8-3a7e-4c7d-b15d-29c396e32e0b	2026-02-02 20:24:43.580227	2026-02-02 20:24:43.580227	doctors	cta	{"phone": "+977 9841-234567", "title": "Need Help Finding the Right Doctor?", "subtitle": "Our team is here to help you find the right specialist for your dental needs. Contact us for a consultation.", "primaryCtaText": "Book Appointment", "secondaryCtaText": "Call Now"}	\N
bb8ba680-911b-4f58-92d9-4bd2bb6a4730	2026-02-02 20:24:43.583346	2026-02-02 20:24:43.583346	patients	hero	{"title": "Patient Information", "subtitle": "Everything you need to know for a comfortable and informed dental visit at Om Chabahil Dental Hospital."}	{"title": "Patient Information | Om Chabahil Dental Hospital", "keywords": ["patient information", "dental visit", "appointment", "patient guide"], "description": "Everything you need to know for a comfortable and informed dental visit. Appointment booking, clinic hours, treatment prices, and FAQs."}
c5a72871-15fa-443e-97bc-cbd578805b21	2026-02-02 20:24:43.585934	2026-02-02 20:24:43.585934	patients	guides	{"guides": [{"title": "Appointment Booking", "description": "Book your appointment online or call us. Walk-ins are also welcome during clinic hours."}, {"title": "Clinic Hours", "description": "Sunday - Friday: 7:00 AM - 7:00 PM, Saturday: 8:00 AM - 5:00 PM"}, {"title": "First Visit", "description": "Bring your ID, any previous dental records, and list of current medications."}, {"title": "Insurance & Payment", "description": "We accept cash, cards, and major insurance providers. Payment plans available."}]}	\N
69f82566-dec6-42e0-a278-3d3e2bc65f79	2026-02-02 20:24:43.588659	2026-02-02 20:24:43.588659	patients	price-guide	{"title": "Treatment Price Guide", "subtitle": "Transparent pricing for our dental services. Actual costs may vary based on individual cases.", "disclaimer": "* Prices are indicative and may vary. Please consult with our doctors for accurate estimates.", "treatments": [{"name": "Dental Check-up", "price": "Rs. 500 - 1,000", "duration": "30-45 mins", "description": "Comprehensive oral examination and consultation"}, {"name": "Teeth Cleaning", "price": "Rs. 1,200 - 2,000", "duration": "45-60 mins", "description": "Professional scaling and polishing"}, {"name": "Dental Filling", "price": "Rs. 1,500 - 3,000", "duration": "30-60 mins", "description": "Composite or amalgam filling for cavities"}, {"name": "Root Canal Treatment", "price": "Rs. 5,000 - 15,000", "duration": "60-90 mins", "description": "Single or multi-visit RCT procedure"}, {"name": "Tooth Extraction", "price": "Rs. 1,000 - 5,000", "duration": "30-60 mins", "description": "Simple to surgical extraction"}, {"name": "Dental Crown", "price": "Rs. 4,000 - 15,000", "duration": "Multiple visits", "description": "PFM, Zirconia, or E-max crown"}, {"name": "Orthodontic Braces", "price": "Rs. 35,000 - 80,000", "duration": "12-24 months", "description": "Metal, ceramic, or clear aligners"}, {"name": "Dental Implant", "price": "Rs. 40,000 - 80,000", "duration": "3-6 months", "description": "Complete implant with crown"}]}	\N
2715c439-8115-4bce-a35e-cd23fcf4aa71	2026-02-02 20:24:43.591811	2026-02-02 20:24:43.591811	patients	before-after	{"afterCare": {"items": ["Follow post-treatment instructions carefully", "Take prescribed medications as directed", "Maintain good oral hygiene", "Attend follow-up appointments", "Contact us immediately if you experience complications"], "title": "After Care Tips"}, "beforeVisit": {"items": ["Brush and floss your teeth before your appointment", "Arrive 15 minutes early for paperwork (first visit)", "Bring a list of current medications", "Note any dental concerns or symptoms", "Avoid eating heavily right before procedures"], "title": "Before Your Visit"}}	\N
4f002714-22c9-44bd-864d-7c38d17dfbab	2026-02-02 20:24:43.594466	2026-02-02 20:24:43.594466	patients	video	{"title": "Take a Virtual Tour", "subtitle": "Explore our modern clinic facilities from the comfort of your home.", "videoPath": "/videos/tour-1.mp4", "posterImage": "/images/clinic-1.jpg"}	\N
cd93b4a7-47db-4e24-8be8-f2677533e1e0	2026-02-02 20:24:43.596493	2026-02-02 20:24:43.596493	patients	faqs	{"faqs": [{"answer": "You can book an appointment through our website, call us at +977 9841-234567, or visit our clinic directly. Online booking is available 24/7.", "question": "How do I book an appointment?"}, {"answer": "Please bring a valid ID, any previous dental X-rays or records, a list of current medications, and your insurance card if applicable.", "question": "What should I bring for my first visit?"}, {"answer": "Yes, we accept most major insurance providers. Please contact our front desk to verify your coverage before your appointment.", "question": "Do you accept insurance?"}, {"answer": "We accept cash, credit/debit cards, eSewa, Khalti, and bank transfers. Payment plans are available for major treatments.", "question": "What payment methods do you accept?"}, {"answer": "Yes, we provide emergency dental services. Please call our emergency line for immediate assistance outside regular hours.", "question": "Is emergency dental care available?"}, {"answer": "We recommend a dental check-up every 6 months for optimal oral health. Some patients may need more frequent visits based on their dental condition.", "question": "How often should I visit the dentist?"}], "title": "Frequently Asked Questions", "subtitle": "Common questions from our patients answered."}	\N
a621f7a4-00c8-49d6-ac87-974b4981b565	2026-02-02 20:24:43.598903	2026-02-02 20:24:43.598903	patients	cta	{"phone": "+977 9841-234567", "title": "Ready to Schedule Your Visit?", "subtitle": "Book your appointment online or give us a call. We look forward to caring for your smile!", "primaryCtaText": "Book Appointment", "secondaryCtaText": "Call Now"}	\N
7116193e-62a5-4225-b83f-67689d765d78	2026-02-02 20:24:43.602154	2026-02-02 20:24:43.602154	contact	hero	{"title": "Contact Us", "subtitle": "Have questions? We'd love to hear from you. Visit our clinic or send us a message."}	{"title": "Contact Us | Om Chabahil Dental Hospital", "keywords": ["contact", "dental hospital", "Kathmandu", "appointment"], "description": "Get in touch with Om Chabahil Dental Hospital. Visit our clinic in Kathmandu or send us a message."}
6edeea79-c25f-464d-84c9-d749de47b0f3	2026-02-02 20:24:43.604534	2026-02-02 20:24:43.604534	contact	info	{"title": "Get in Touch", "contactInfo": [{"lines": ["Chabahil, Koteshwor", "Kathmandu, Nepal"], "title": "Visit Us"}, {"lines": ["+977 9841-234567", "+977 01-4567890"], "title": "Call Us"}, {"lines": ["info@omchabahildental.com.np", "appointment@omchabahildental.com.np"], "title": "Email Us"}, {"lines": ["Sun - Fri: 7:00 AM - 7:00 PM", "Saturday: 8:00 AM - 5:00 PM"], "title": "Working Hours"}], "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456!2d85.3451!3d27.7102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900db123456%3A0x1234567890abcdef!2sChabahil%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"}	\N
3c8278ea-7e13-4a4d-b0b4-52825658fb3e	2026-02-02 20:24:43.607347	2026-02-02 20:24:43.607347	contact	quick-contact	{"phone": "+977 9841-234567", "title": "Need Immediate Assistance?", "subtitle": "For appointments and urgent dental queries, call us directly", "whatsapp": "+977 9841-234567"}	\N
63c32e60-456c-45ff-8a12-48edfc5bb036	2026-02-02 20:24:43.609532	2026-02-02 20:24:43.609532	academics	hero	{"title": "Academic Programs", "subtitle": "World-class dental education combining rigorous academics with hands-on clinical experience to prepare you for a successful career in dentistry."}	{"title": "Academic Programs | Premier Dental College", "keywords": ["academic programs", "BDS", "MDS", "dental education"], "description": "Explore our BDS, MDS, and internship programs. World-class dental education with experienced faculty and modern facilities."}
af7a5ec3-3c0a-4de3-8f95-006c1992c8be	2026-02-02 20:24:43.611552	2026-02-02 20:24:43.611552	academics	stats	{"stats": [{"label": "Programs Offered", "value": "10+"}, {"label": "Expert Faculty", "value": "50+"}, {"label": "Alumni Network", "value": "5000+"}, {"label": "Years of Excellence", "value": "25+"}]}	\N
3db6bf78-b258-4e6c-a205-d8c71bc904da	2026-02-02 20:24:43.613771	2026-02-02 20:24:43.613771	academics	programs	{"title": "Our Programs", "subtitle": "Choose from our range of undergraduate, postgraduate, and certificate programs."}	\N
1d735703-c41d-4f70-9bc1-1b37f90f1826	2026-02-02 20:24:43.616451	2026-02-02 20:24:43.616451	academics	mds-specializations	{"title": "MDS Specializations", "subtitle": "Choose from our comprehensive range of postgraduate specialization programs.", "specializations": ["Orthodontics & Dentofacial Orthopedics", "Oral & Maxillofacial Surgery", "Prosthodontics & Crown Bridge", "Conservative Dentistry & Endodontics", "Periodontics", "Pedodontics & Preventive Dentistry", "Oral Pathology & Microbiology", "Public Health Dentistry"]}	\N
3b3e5a41-84c9-477a-9212-dc2e6faa1c5e	2026-02-02 20:24:43.619225	2026-02-02 20:24:43.619225	academics	cta	{"title": "Ready to Begin Your Dental Journey?", "subtitle": "Take the first step towards a rewarding career in dentistry. Apply now for our upcoming academic session.", "primaryCtaText": "Apply Now", "secondaryCtaText": "Request Information"}	\N
50a25dd1-9aee-45ee-bd70-e4b292117e4f	2026-02-02 20:24:43.622027	2026-02-02 20:24:43.622027	gallery	hero	{"title": "Photo & Video Gallery", "subtitle": "Explore our clinic, meet our team, and see the quality care we provide at Om Chabahil Dental Hospital."}	{"title": "Gallery | Om Chabahil Dental Hospital", "keywords": ["gallery", "clinic photos", "dental clinic", "virtual tour"], "description": "Explore our clinic, meet our team, and see the quality care we provide through our photo and video gallery."}
903d1f15-6cf2-4012-a357-18c9de5ca84a	2026-02-02 20:24:43.625065	2026-02-02 20:24:43.625065	blog	hero	{"title": "Dental Knowledge Hub", "subtitle": "Expert insights, dental health tips, and the latest news from our team of dental professionals."}	{"title": "Blog & Dental Tips | Om Chabahil Dental Hospital", "keywords": ["blog", "dental tips", "oral health", "dental news"], "description": "Explore dental health tips, oral care advice, and the latest news from Om Chabahil Dental Hospital in Kathmandu."}
dcc0deaf-a865-4c15-9cde-2b961b9611b5	2026-02-02 20:24:43.627696	2026-02-02 20:24:43.627696	blog	newsletter	{"title": "Subscribe to Our Newsletter", "subtitle": "Get the latest dental health tips and news delivered to your inbox."}	\N
07ff2d8e-6483-4665-9eb8-a5215cd9e57c	2026-02-02 20:24:43.630163	2026-02-02 20:24:43.630163	academics/admissions	hero	{"title": "Online Admission Application", "subtitle": "Apply for BDS, MDS, and other dental programs"}	{"title": "Online Admission Application | Premier Dental College", "keywords": ["admission", "application", "BDS", "MDS", "dental college"], "description": "Apply for BDS, MDS, and other dental programs online. Complete your admission application in simple steps."}
06bcd0e7-a228-4731-bfed-5daae646f45a	2026-02-02 20:24:43.667582	2026-02-02 20:24:43.667582	gallery	items	{"items": [{"id": 1, "src": "/images/team.jpg", "type": "image", "title": "Our Dental Team", "category": "Team", "description": "The dedicated team at Om Chabahil Dental Hospital"}, {"id": 2, "src": "/images/clinic-1.jpg", "type": "image", "title": "Modern Treatment Room", "category": "Clinic", "description": "State-of-the-art dental treatment facility"}, {"id": 3, "src": "/images/clinic-2.jpg", "type": "image", "title": "Reception Area", "category": "Clinic", "description": "Welcoming reception and waiting area"}, {"id": 4, "src": "/images/clinic-3.jpg", "type": "image", "title": "Dental Equipment", "category": "Clinic", "description": "Advanced dental technology and equipment"}, {"id": 5, "src": "/images/clinic-4.jpg", "type": "image", "title": "Treatment in Progress", "category": "Treatments", "description": "Professional dental care procedures"}, {"id": 6, "src": "/images/clinic-5.jpg", "type": "image", "title": "Clinic Interior", "category": "Clinic", "description": "Clean and modern clinic environment"}, {"id": 7, "src": "/videos/tour-1.mp4", "type": "video", "title": "Clinic Tour Video", "category": "Clinic", "thumbnail": "/images/clinic-1.jpg", "description": "Take a virtual tour of our dental clinic"}, {"id": 8, "src": "/videos/tour-2.mp4", "type": "video", "title": "Treatment Procedure", "category": "Treatments", "thumbnail": "/images/clinic-2.jpg", "description": "Overview of our treatment procedures"}], "categories": ["All", "Clinic", "Team", "Treatments", "Events"]}	\N
2e276d22-8957-4765-a325-487b0b116dde	2026-02-02 20:24:43.670379	2026-02-02 20:24:43.670379	settings	general	{"city": "Kathmandu", "state": "Bagmati", "address": "Chabahil, Koteshwor, Kathmandu, Nepal", "country": "Nepal", "siteName": "Om Chabahil Dental Hospital", "postalCode": "44600", "siteTagline": "Your Smile, Our Priority", "socialMedia": {"twitter": "", "youtube": "", "facebook": "", "linkedin": "", "instagram": ""}, "primaryEmail": "info@omchabahildental.com.np", "primaryPhone": "+977 01-4812345", "workingHours": {"saturday": "Saturday: 8:00 AM - 5:00 PM", "weekdays": "Sunday - Friday: 7:00 AM - 7:00 PM", "emergency": "24/7 Emergency Services Available"}, "secondaryPhone": "+977 01-4567890", "whatsappNumber": "+977 9841-234567", "appointmentEmail": "appointment@omchabahildental.com.np", "whatsappQuickMessages": ["I want to book an appointment", "I need information about BDS admission", "What are your clinic timings?", "I have a dental emergency"]}	\N
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.services (id, created_at, updated_at, name, slug, short_description, description, icon, image, gallery, department_id, is_active, "order") FROM stdin;
7c84eab9-8d23-4cea-af70-edf23fa1a93a	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Orthodontics	orthodontics	Braces, aligners, and teeth straightening solutions for a perfect smile.	Achieve a perfect smile with our comprehensive orthodontic treatments using the latest techniques and technology. We offer traditional metal braces, ceramic braces, clear aligners (Invisalign), lingual braces, and retainers with follow-up care.	\N	/images/service-orthodontics.jpg	\N	c18471ff-2005-4944-afa3-29ff48ecd011	t	2
558ba20f-c80b-4d95-adc4-0b747c48429f	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Oral & Maxillofacial Surgery	oral-maxillofacial-surgery	Expert surgical procedures including extractions, implants, and jaw surgery.	Expert surgical solutions for complex dental and facial conditions by our experienced oral surgeons. Services include wisdom tooth extraction, dental implant placement, jaw surgery (orthognathic), facial trauma treatment, and TMJ disorder treatment.	\N	/images/service-surgery.jpg	\N	0cb44c26-127f-4e4a-b8d9-2c93af561d40	t	3
c7c15d64-44de-4ef8-ad96-d60b02ff150c	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Pediatric Dentistry	pediatric-dentistry	Gentle, specialized dental care designed for children of all ages.	Gentle, child-friendly dental care designed to make your little ones feel comfortable and happy. We provide first dental visit guidance, preventive treatments, fluoride application, dental sealants, and behavior management.	\N	/images/service-pediatric.jpg	\N	1cf415be-42ee-4f61-952e-8a664f260710	t	4
5ea5220e-59ec-4539-aefa-236bf9503d9c	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Cosmetic Dentistry	cosmetic-dentistry	Teeth whitening, veneers, and smile makeovers for your dream smile.	Transform your smile with our range of cosmetic procedures designed to enhance your appearance. We offer teeth whitening, porcelain veneers, dental bonding, smile makeovers, and gum contouring.	\N	/images/service-cosmetic.jpg	\N	fd147cf6-7398-4576-9260-adc44144a5e7	t	5
5e21aa1e-d751-4a31-b36e-5df60051c2d9	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Endodontics	endodontics	Root canal treatments and other procedures to save damaged teeth.	Save your natural teeth with our specialized root canal treatments and endodontic procedures. We provide root canal treatment, endodontic retreatment, apicoectomy, dental trauma management, and pulp therapy.	\N	/images/service-endodontics.jpg	\N	e67f6a85-f397-4aaa-895b-c03608b41ae8	t	6
c483ca81-d252-4a9d-86f6-822cb606f1c7	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Prosthodontics	prosthodontics	Dental crowns, bridges, dentures, and full mouth rehabilitation.	Restore function and aesthetics with our comprehensive prosthetic dental solutions. We offer dental crowns and bridges, complete dentures, partial dentures, implant-supported prosthetics, and full mouth rehabilitation.	\N	/images/service-prosthodontics.jpg	\N	0c50529e-cc42-4349-9460-d9718499faca	t	7
8e70945b-e0d2-4675-b712-367713fd2c8c	2026-02-02 20:24:43.639263	2026-02-02 20:24:43.639263	Periodontics	periodontics	Specialized care for your gums and supporting structures.	Specialized care for your gums and supporting structures to maintain a healthy foundation for your teeth. We provide scaling and root planing, gum grafting, crown lengthening, pocket reduction surgery, and dental implants.	\N	/images/service-periodontics.jpg	\N	616df675-8aa6-4c76-bf8a-8a967a7e72cd	t	8
58b4e230-18de-4667-a827-6b554ac362c1	2026-02-02 20:24:43.639263	2026-02-03 18:48:40.493405	General Dentistry	general-dentistry	Our general dentistry services cover all aspects of preventive and restorative dental care to maintain your oral health. We provide dental examinations and cleanings, cavity fillings and restorations, tooth extractions, gum disease treatment, and dental X-rays and diagnostics.	Our general dentistry services cover all aspects of preventive and restorative dental care to maintain your oral health. We provide dental examinations and cleanings, cavity fillings and restorations, tooth extractions, gum disease treatment, and dental X-rays and diagnostics.	\N	/images/service-general.jpg	\N	fd147cf6-7398-4576-9260-adc44144a5e7	t	1
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.settings (id, created_at, updated_at, key, value, category, description) FROM stdin;
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.testimonials (id, created_at, updated_at, name, role, content, rating, photo, is_active, "order") FROM stdin;
28f013c3-d137-4174-9b25-88e9453ff477	2026-02-02 20:24:43.517117	2026-02-02 20:24:43.517117	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
e9fa734e-e6a2-4178-9074-ffdf427a3b00	2026-02-02 20:24:43.517117	2026-02-02 20:24:43.517117	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
88ae9c1e-65c7-442f-8c2c-9f54f7c16a19	2026-02-02 20:24:43.517117	2026-02-02 20:24:43.517117	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
3c9006c4-1236-4e2a-a6ef-b8a7e348a629	2026-02-02 20:24:43.517117	2026-02-02 20:24:43.517117	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
6517cb52-dc56-4470-b378-cba389f1afd0	2026-02-02 20:24:43.517117	2026-02-02 20:24:43.517117	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
a6d6b970-c615-444f-ab41-8098880926f3	2026-02-02 20:24:43.517117	2026-02-02 20:24:43.517117	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
a7f246ab-bce9-40f8-a3c4-ea39b63b68af	2026-02-02 20:31:50.606108	2026-02-02 20:31:50.606108	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
a61f960f-d093-4f8d-ab03-cc88f477f66b	2026-02-02 20:31:50.606108	2026-02-02 20:31:50.606108	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
4c407f8f-c6fb-420e-abcd-088d82fc3000	2026-02-02 20:31:50.606108	2026-02-02 20:31:50.606108	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
1824e88c-5722-4327-ab82-92beb4f7d4dc	2026-02-02 20:31:50.606108	2026-02-02 20:31:50.606108	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
06e54fe0-0a94-48a7-aca1-bdb4571b4254	2026-02-02 20:31:50.606108	2026-02-02 20:31:50.606108	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
27561ff7-218f-4223-8f39-118e3a5b6875	2026-02-02 20:31:50.606108	2026-02-02 20:31:50.606108	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
98e2680f-9ad8-4d82-a6fb-1db50257b55c	2026-02-02 20:37:05.591159	2026-02-02 20:37:05.591159	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
81f0880f-1f22-4526-8d9e-2271daf60250	2026-02-02 20:37:05.591159	2026-02-02 20:37:05.591159	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
01b6983f-6939-4678-9516-3d1510ed5ef9	2026-02-02 20:37:05.591159	2026-02-02 20:37:05.591159	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
bf144dea-45dc-49ef-a60e-f62444adce93	2026-02-02 20:37:05.591159	2026-02-02 20:37:05.591159	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
200dd437-0a04-4320-9259-22c705e7133a	2026-02-02 20:37:05.591159	2026-02-02 20:37:05.591159	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
8ed1a5ff-868d-404a-b458-4eb74a81226f	2026-02-02 20:37:05.591159	2026-02-02 20:37:05.591159	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
628b6f70-f17b-4f9e-9ee1-76794073cff9	2026-02-02 20:37:43.042041	2026-02-02 20:37:43.042041	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
7db74888-debb-47eb-800b-59142033d519	2026-02-02 20:37:43.042041	2026-02-02 20:37:43.042041	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
e0c71088-f8b9-4f82-8265-784e1e528fc9	2026-02-02 20:37:43.042041	2026-02-02 20:37:43.042041	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
956f33de-ca2b-4f15-ab19-6f5db95b22e8	2026-02-02 20:37:43.042041	2026-02-02 20:37:43.042041	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
f84586af-8d8a-4ace-8656-ed2cfcfdd964	2026-02-02 20:37:43.042041	2026-02-02 20:37:43.042041	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
cbc0a75e-4312-41b9-8c6b-fcfb73186b8b	2026-02-02 20:37:43.042041	2026-02-02 20:37:43.042041	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
514c519f-e0a8-4dc4-a8f6-38327b77c98a	2026-02-02 20:38:12.386549	2026-02-02 20:38:12.386549	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
93f70f15-1eb4-404b-ade8-2402db88affa	2026-02-02 20:38:12.386549	2026-02-02 20:38:12.386549	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
3da23bb3-8350-4140-a28c-533b745120e4	2026-02-02 20:38:12.386549	2026-02-02 20:38:12.386549	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
6d7e15d0-b681-4faf-b952-5dc9ec627125	2026-02-02 20:38:12.386549	2026-02-02 20:38:12.386549	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
6d755889-6c3e-4e81-a192-8724a00a642b	2026-02-02 20:38:12.386549	2026-02-02 20:38:12.386549	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
a02f8c7a-bfe2-4463-ad18-739e354d7ad1	2026-02-02 20:38:12.386549	2026-02-02 20:38:12.386549	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
afcffef8-20a3-4ff6-9dde-498fee9cf4db	2026-02-02 20:38:34.800821	2026-02-02 20:38:34.800821	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
c19f003b-ce44-4f06-b656-7187d2621988	2026-02-02 20:38:34.800821	2026-02-02 20:38:34.800821	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
9892f6b6-b16a-4b21-9fed-f56f7c00856f	2026-02-02 20:38:34.800821	2026-02-02 20:38:34.800821	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
336470db-0032-4634-93e2-155062434824	2026-02-02 20:38:34.800821	2026-02-02 20:38:34.800821	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
5332a043-18ed-4fd6-8a28-86f8e99340f0	2026-02-02 20:38:34.800821	2026-02-02 20:38:34.800821	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
e405cbe6-8a67-42d7-84fe-291a91fe7bee	2026-02-02 20:38:34.800821	2026-02-02 20:38:34.800821	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
f508590f-eca6-44c1-91a0-724651a17342	2026-02-02 21:03:43.197511	2026-02-02 21:03:43.197511	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
b9b8bd97-00e1-4c75-83bb-58ad80bc3c4b	2026-02-02 21:03:43.197511	2026-02-02 21:03:43.197511	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
fd9fb32f-5783-4251-a057-c9652087ecf0	2026-02-02 21:03:43.197511	2026-02-02 21:03:43.197511	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
60b42b80-1135-4111-aa5d-cda79324d091	2026-02-02 21:03:43.197511	2026-02-02 21:03:43.197511	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
fc64bcda-5924-4446-a93d-4424c392dc60	2026-02-02 21:03:43.197511	2026-02-02 21:03:43.197511	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
15ed0cd1-c223-4576-bfc4-ca9374b4b2b9	2026-02-02 21:03:43.197511	2026-02-02 21:03:43.197511	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
6deac31a-056c-4af5-af0f-45ffcf23b05b	2026-02-03 17:46:45.001941	2026-02-03 17:46:45.001941	Sarah Johnson	Patient	The care I received at Premier Dental was exceptional. The staff was incredibly professional, and the dentist took the time to explain every procedure. I've never felt more comfortable at a dental clinic.	5	\N	t	1
c07b6683-6ae1-4beb-bc57-1373fbfe299b	2026-02-03 17:46:45.001941	2026-02-03 17:46:45.001941	Dr. James Wilson	BDS Alumni 2018	My education at Premier Dental College prepared me exceptionally well for my career. The clinical exposure and mentorship I received were invaluable. I'm now running my own successful practice.	5	\N	t	2
83fe56c2-a03c-45a8-ab4a-68d05bea880c	2026-02-03 17:46:45.001941	2026-02-03 17:46:45.001941	Emily Chen	Parent	Finding a dentist my kids actually want to visit was a miracle! The pediatric team is amazing - patient, gentle, and great at making dental visits fun. Both my children now love going to the dentist.	5	\N	t	3
d60d379d-918e-4545-b988-a1f6e303c7ac	2026-02-03 17:46:45.001941	2026-02-03 17:46:45.001941	Michael Rodriguez	Patient	After years of avoiding dentists, I finally found one I trust. The entire team made me feel at ease, and the results of my smile makeover exceeded all my expectations.	5	\N	t	4
bd06f530-9e61-48d1-8d70-5222eacf65ca	2026-02-03 17:46:45.001941	2026-02-03 17:46:45.001941	Dr. Michael Chen	BDS Alumni 2020	Premier Dental College provided me with the best education and clinical experience. I am now running my own successful practice.	5	\N	t	5
2ec76bcb-8096-44d7-968d-54c58f530e53	2026-02-03 17:46:45.001941	2026-02-03 17:46:45.001941	Emily Williams	Patient	My children love visiting this dental clinic. The pediatric team is amazing with kids!	5	\N	t	6
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dental_user
--

COPY public.users (id, created_at, updated_at, email, password, name, role, avatar, is_active, last_login, refresh_token) FROM stdin;
f4dd7006-3163-45d0-882b-1cec3572047f	2026-02-02 18:06:57.623731	2026-02-02 18:44:12.952756	sabina@gmail.com	$2a$10$1BC/OeUFdi8Sn5tT9Hkfq.smbtodCKfpOFOlSxJ/HZM/on.6fuZHu	sabina	staff	\N	t	2026-02-02 18:44:12.872	$2a$10$D592HJEg5XjCdmFc6.IfpuKb7eyzeKRV4IDD9voSOLxrpYbmKYE3a
bb660130-6d77-4ac6-83e0-cf6e615b8d6c	2026-02-02 15:52:42.731935	2026-02-02 18:45:02.653207	owner@premierdentalcollege.edu	$2a$10$Lvrb545c7zrD/MvAoxzdoeqNXIJVc0inE6VGNP4nUfo.rnMGKuH/S	Main Admin	super_admin	\N	t	2026-02-02 18:45:02.571	$2a$10$00Z7Sbcq2yujfbyOVmo/TeEOSYvKIJJtdUMTVBwBPHGEcQeeSlwj6
47aebc15-78a2-4227-a27e-d58d8385a24e	2026-02-02 20:24:43.460202	2026-02-02 20:24:43.460202	admin@premierdentalcollege.edu	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	System Administrator	super_admin	\N	t	\N	\N
f68fa908-46e2-4108-8a12-53abd607fdac	2026-02-02 20:37:05.700347	2026-02-02 20:37:05.700347	admin@omchabahildental.com.np	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Admin User	admin	\N	t	\N	\N
0cd5cb21-86cc-4577-bdcb-519160f81094	2026-02-02 20:37:05.700347	2026-02-02 20:37:05.700347	staff@omchabahildental.com.np	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Staff User	staff	\N	t	\N	\N
20d19546-5d8b-42c8-8fd9-e5077d1593a5	2026-02-02 18:49:45.408031	2026-02-04 11:14:24.349025	admin@gmail.com	$2a$10$reazJjBl2LhRE3pKh7SiaOmyrkPXgsVrahxoesI3fetx6u..MUmUS	admin	admin	\N	t	2026-02-04 11:14:24.23	$2a$10$eQpUdfBUkmIlEEMHPAoM5u06ssTng4emrkmbKB2wq4Z3VdLZswo9.
\.


--
-- Name: settings PK_0669fe20e252eb692bf4d344975; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY (id);


--
-- Name: enquiries PK_1516c8a887df94dc119a1db749e; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT "PK_1516c8a887df94dc119a1db749e" PRIMARY KEY (id);


--
-- Name: academic_programs PK_27e387feaac71037c08230a06bb; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.academic_programs
    ADD CONSTRAINT "PK_27e387feaac71037c08230a06bb" PRIMARY KEY (id);


--
-- Name: doctor_availabilities PK_2a42931ed0fe3c6934b737c503a; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctor_availabilities
    ADD CONSTRAINT "PK_2a42931ed0fe3c6934b737c503a" PRIMARY KEY (id);


--
-- Name: appointments PK_4a437a9a27e948726b8bb3e36ad; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY (id);


--
-- Name: clinics PK_5513b659e4d12b01a8ab3956abc; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY (id);


--
-- Name: faculty PK_635ca3484f9c747b6635a494ad9; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT "PK_635ca3484f9c747b6635a494ad9" PRIMARY KEY (id);


--
-- Name: testimonials PK_63b03c608bd258f115a0a4a1060; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT "PK_63b03c608bd258f115a0a4a1060" PRIMARY KEY (id);


--
-- Name: doctors PK_8207e7889b50ee3695c2b8154ff; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY (id);


--
-- Name: departments PK_839517a681a86bb84cbcc6a1e9d; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY (id);


--
-- Name: media_files PK_93b4da6741cd150e76f9ac035d8; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT "PK_93b4da6741cd150e76f9ac035d8" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: admission_applications PK_ad1210c5f52263b40753399b622; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT "PK_ad1210c5f52263b40753399b622" PRIMARY KEY (id);


--
-- Name: services PK_ba2d347a3168a296416c6c5ccb2; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY (id);


--
-- Name: page_content PK_c2b7b56ba057b319ed037ed878b; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT "PK_c2b7b56ba057b319ed037ed878b" PRIMARY KEY (id);


--
-- Name: doctor_leaves PK_cd0ef4ced184a629a4d5dd380ed; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctor_leaves
    ADD CONSTRAINT "PK_cd0ef4ced184a629a4d5dd380ed" PRIMARY KEY (id);


--
-- Name: blog_posts PK_dd2add25eac93daefc93da9d387; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY (id);


--
-- Name: services UQ_02cf0d0f46e11d22d952f623670; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT "UQ_02cf0d0f46e11d22d952f623670" UNIQUE (slug);


--
-- Name: clinics UQ_1c4933755297e407da44d46031c; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT "UQ_1c4933755297e407da44d46031c" UNIQUE (slug);


--
-- Name: academic_programs UQ_4a9d96d7bac6d0499155d57da77; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.academic_programs
    ADD CONSTRAINT "UQ_4a9d96d7bac6d0499155d57da77" UNIQUE (slug);


--
-- Name: blog_posts UQ_5b2818a2c45c3edb9991b1c7a51; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT "UQ_5b2818a2c45c3edb9991b1c7a51" UNIQUE (slug);


--
-- Name: admission_applications UQ_5bb5c9e56de7708b31f4c0e138a; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT "UQ_5bb5c9e56de7708b31f4c0e138a" UNIQUE (application_number);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: departments UQ_a23b1fdc69006219d8acc76c04f; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT "UQ_a23b1fdc69006219d8acc76c04f" UNIQUE (slug);


--
-- Name: settings UQ_c8639b7626fa94ba8265628f214; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE (key);


--
-- Name: page_content UQ_f04e4efd8e1815ddec794e163bb; Type: CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT "UQ_f04e4efd8e1815ddec794e163bb" UNIQUE (page_slug, section_key);


--
-- Name: faculty FK_008d2d8e1cfff7ed33b6c4029bf; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT "FK_008d2d8e1cfff7ed33b6c4029bf" FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: doctors FK_3672b55bcb332e54bc8d8cda1c1; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "FK_3672b55bcb332e54bc8d8cda1c1" FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: admission_applications FK_3ea77894bdce230fcab34b2ac27; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT "FK_3ea77894bdce230fcab34b2ac27" FOREIGN KEY (program_id) REFERENCES public.academic_programs(id);


--
-- Name: appointments FK_4cf26c3f972d014df5c68d503d2; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- Name: doctors FK_653c27d1b10652eb0c7bbbc4427; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: enquiries FK_7cd8ff13ddd8446af7dd4eb5da1; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT "FK_7cd8ff13ddd8446af7dd4eb5da1" FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: doctor_availabilities FK_aa49ce7b9ff575a2963abcb6910; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctor_availabilities
    ADD CONSTRAINT "FK_aa49ce7b9ff575a2963abcb6910" FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: blog_posts FK_c3fc4a3a656aad74331acfcf2a9; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: doctor_leaves FK_d9896f0becfc0dba8b724c5459b; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.doctor_leaves
    ADD CONSTRAINT "FK_d9896f0becfc0dba8b724c5459b" FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: services FK_fe8dcab94e4095af071399c6523; Type: FK CONSTRAINT; Schema: public; Owner: dental_user
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT "FK_fe8dcab94e4095af071399c6523" FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 34EDXGGgC45l2udrfar9fFOLbG7zbkfwZdB4UMfPrbvBfTfhEeExD0eVVTsgVD5

