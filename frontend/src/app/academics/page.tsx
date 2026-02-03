import { Metadata } from 'next';
// Images replaced with placeholders
import Link from 'next/link';
import { FiArrowRight, FiBook, FiClock, FiUsers, FiAward } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Academic Programs | Premier Dental College',
  description: 'Explore our BDS, MDS, and internship programs. World-class dental education with experienced faculty and modern facilities.',
};

const programs = [
  {
    id: 'bds',
    title: 'Bachelor of Dental Surgery (BDS)',
    duration: '5 years (4 years + 1 year internship)',
    type: 'Undergraduate',
    description: 'Our flagship undergraduate program providing comprehensive education in dental sciences with extensive clinical training.',
    highlights: [
      'Comprehensive dental curriculum',
      'Hands-on clinical experience from year 2',
      'Modern simulation labs',
      'Research opportunities',
    ],
    image: '/images/program-bds.jpg',
    href: '/academics/bds',
  },
  {
    id: 'mds',
    title: 'Master of Dental Surgery (MDS)',
    duration: '3 years',
    type: 'Postgraduate',
    description: 'Advanced specialization programs in various dental disciplines for those seeking expertise in specific areas.',
    highlights: [
      '8 specialization tracks',
      'Research-focused curriculum',
      'Expert faculty mentorship',
      'Publication opportunities',
    ],
    image: '/images/program-mds.jpg',
    href: '/academics/mds',
  },
  {
    id: 'internship',
    title: 'Dental Internship Program',
    duration: '1 year',
    type: 'Clinical Training',
    description: 'Comprehensive rotational internship providing hands-on experience across all dental specialties.',
    highlights: [
      'Rotation across all departments',
      'Supervised patient care',
      'Emergency dental training',
      'Community outreach programs',
    ],
    image: '/images/program-internship.jpg',
    href: '/academics/internships',
  },
];

const stats = [
  { icon: FiBook, value: '10+', label: 'Programs Offered' },
  { icon: FiUsers, value: '50+', label: 'Expert Faculty' },
  { icon: FiAward, value: '5000+', label: 'Alumni Network' },
  { icon: FiClock, value: '25+', label: 'Years of Excellence' },
];

export default function AcademicsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Academic Programs
            </h1>
            <p className="text-xl text-primary-200">
              World-class dental education combining rigorous academics with hands-on 
              clinical experience to prepare you for a successful career in dentistry.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Programs</h2>
            <p className="section-subtitle mx-auto">
              Choose from our range of undergraduate, postgraduate, and certificate programs.
            </p>
          </div>

          <div className="space-y-8">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`aspect-[4/3] lg:aspect-auto lg:min-h-[300px] bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <span className="text-primary-500/50 text-lg">{program.title}</span>
                  </div>
                  <div className={`p-8 lg:p-12 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <span className="badge-primary mb-4">{program.type}</span>
                    <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-primary-600 font-medium mb-4">
                      Duration: {program.duration}
                    </p>
                    <p className="text-neutral-600 mb-6">
                      {program.description}
                    </p>
                    <ul className="grid grid-cols-2 gap-3 mb-8">
                      {program.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-neutral-700">
                          <svg className="w-5 h-5 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={program.href} className="btn-primary">
                      Learn More
                      <FiArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MDS Specializations */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">MDS Specializations</h2>
            <p className="section-subtitle mx-auto">
              Choose from our comprehensive range of postgraduate specialization programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Orthodontics & Dentofacial Orthopedics',
              'Oral & Maxillofacial Surgery',
              'Prosthodontics & Crown Bridge',
              'Conservative Dentistry & Endodontics',
              'Periodontics',
              'Pedodontics & Preventive Dentistry',
              'Oral Pathology & Microbiology',
              'Public Health Dentistry',
            ].map((specialization, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl p-6 hover:bg-primary-50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-600 font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-neutral-900">{specialization}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission CTA */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to Begin Your Dental Journey?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Take the first step towards a rewarding career in dentistry. 
            Apply now for our upcoming academic session.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/academics/admissions" className="btn-white">
              Apply Now
            </Link>
            <Link href="/contact" className="btn bg-accent-500 text-white hover:bg-accent-600">
              Request Information
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
