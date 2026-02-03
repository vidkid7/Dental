import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiAward, FiUsers, FiTarget, FiHeart, FiMapPin, FiPhone } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'About Us | Om Chabahil Dental Hospital',
  description: 'Learn about Om Chabahil Dental Hospital - Your trusted dental care partner in Kathmandu, Nepal. Quality dental services with modern technology.',
};

const values = [
  {
    icon: FiAward,
    title: 'Quality Care',
    description: 'We maintain the highest standards in dental treatment and patient care.',
  },
  {
    icon: FiUsers,
    title: 'Expert Team',
    description: 'Our experienced dentists and staff work together for your health.',
  },
  {
    icon: FiTarget,
    title: 'Modern Technology',
    description: 'We use the latest dental equipment and techniques.',
  },
  {
    icon: FiHeart,
    title: 'Patient First',
    description: 'Your comfort and satisfaction is our top priority.',
  },
];

const services = [
  'General Dentistry & Check-ups',
  'Root Canal Treatment (RCT)',
  'Dental Implants',
  'Orthodontics (Braces)',
  'Cosmetic Dentistry',
  'Pediatric Dentistry',
  'Oral Surgery',
  'Teeth Whitening',
];

export default function AboutPage() {
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
              About Om Chabahil Dental Hospital
            </h1>
            <p className="text-xl text-primary-200">
              Your trusted dental care partner in Kathmandu. Providing quality dental services 
              with modern technology and experienced professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated">
              <Image
                src="/images/team.jpg"
                alt="Om Chabahil Dental Team"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="section-title mb-6">Our Story</h2>
              <p className="text-neutral-600 mb-4">
                Om Chabahil Dental Hospital was established with a vision to provide accessible, 
                affordable, and quality dental care to the people of Kathmandu. Located in the 
                heart of Koteshwor, we have been serving the community for over a decade.
              </p>
              <p className="text-neutral-600 mb-4">
                Our clinic is equipped with modern dental equipment and follows international 
                standards of sterilization and hygiene. We believe in providing personalized 
                care to each patient, understanding their unique needs and concerns.
              </p>
              <p className="text-neutral-600 mb-6">
                From routine dental check-ups to complex procedures like dental implants and 
                orthodontic treatments, our experienced team is here to help you achieve and 
                maintain a healthy, beautiful smile.
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Visit Us</p>
                  <p className="text-neutral-600">Chabahil, Koteshwor, Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Why Choose Us</h2>
            <p className="section-subtitle mx-auto">
              We are committed to providing the best dental care experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Our Services</h2>
              <p className="text-neutral-600 mb-6">
                We offer a comprehensive range of dental services to meet all your oral 
                health needs. Our team is trained in the latest techniques and uses 
                modern equipment for optimal results.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span className="text-neutral-700">{service}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/services" className="btn-primary">
                View All Services
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-card">
                <Image
                  src="/images/clinic-1.jpg"
                  alt="Dental Clinic"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-card mt-8">
                <Image
                  src="/images/clinic-2.jpg"
                  alt="Dental Equipment"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-card">
                <Image
                  src="/images/clinic-3.jpg"
                  alt="Treatment Room"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-card mt-8">
                <Image
                  src="/images/clinic-4.jpg"
                  alt="Dental Procedure"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Take a Virtual Tour</h2>
            <p className="section-subtitle mx-auto">
              Experience our clinic facilities from the comfort of your home.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
              <video
                className="w-full h-full object-cover"
                controls
                poster="/images/clinic-1.jpg"
              >
                <source src="/videos/tour-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to Visit Us?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience quality dental care at Om Chabahil Dental Hospital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointments/book" className="btn-white">
              Book Appointment
            </Link>
            <a href="tel:+9779841234567" className="btn bg-accent-500 text-white hover:bg-accent-600 flex items-center gap-2">
              <FiPhone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
