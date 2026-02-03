import { Metadata } from 'next';
// Images replaced with placeholders
import Link from 'next/link';
import { 
  FaTooth, 
  FaTeethOpen, 
  FaChild, 
  FaSyringe, 
  FaXRay,
  FaSmile,
  FaTeeth,
  FaTint
} from 'react-icons/fa';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Dental Services | Om Chabahil Dental Hospital',
  description: 'Comprehensive dental services in Kathmandu including general dentistry, orthodontics, root canal, dental implants, cosmetic dentistry, and more.',
};

const services = [
  {
    id: 'general',
    icon: FaTooth,
    title: 'General Dentistry',
    description: 'Our general dentistry services cover all aspects of preventive and restorative dental care to maintain your oral health.',
    features: [
      'Dental examinations and cleanings',
      'Cavity fillings and restorations',
      'Tooth extractions',
      'Gum disease treatment',
      'Dental X-rays and diagnostics',
    ],
    image: '/images/service-general.jpg',
  },
  {
    id: 'orthodontics',
    icon: FaTeethOpen,
    title: 'Orthodontics',
    description: 'Achieve a perfect smile with our comprehensive orthodontic treatments using the latest techniques and technology.',
    features: [
      'Traditional metal braces',
      'Ceramic braces',
      'Clear aligners (Invisalign)',
      'Lingual braces',
      'Retainers and follow-up care',
    ],
    image: '/images/service-orthodontics.jpg',
  },
  {
    id: 'surgery',
    icon: FaSyringe,
    title: 'Oral & Maxillofacial Surgery',
    description: 'Expert surgical solutions for complex dental and facial conditions by our experienced oral surgeons.',
    features: [
      'Wisdom tooth extraction',
      'Dental implant placement',
      'Jaw surgery (orthognathic)',
      'Facial trauma treatment',
      'TMJ disorder treatment',
    ],
    image: '/images/service-surgery.jpg',
  },
  {
    id: 'pediatric',
    icon: FaChild,
    title: 'Pediatric Dentistry',
    description: 'Gentle, child-friendly dental care designed to make your little ones feel comfortable and happy.',
    features: [
      'First dental visit guidance',
      'Preventive treatments',
      'Fluoride application',
      'Dental sealants',
      'Behavior management',
    ],
    image: '/images/service-pediatric.jpg',
  },
  {
    id: 'cosmetic',
    icon: FaSmile,
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with our range of cosmetic procedures designed to enhance your appearance.',
    features: [
      'Teeth whitening',
      'Porcelain veneers',
      'Dental bonding',
      'Smile makeovers',
      'Gum contouring',
    ],
    image: '/images/service-cosmetic.jpg',
  },
  {
    id: 'endodontics',
    icon: FaXRay,
    title: 'Endodontics',
    description: 'Save your natural teeth with our specialized root canal treatments and endodontic procedures.',
    features: [
      'Root canal treatment',
      'Endodontic retreatment',
      'Apicoectomy',
      'Dental trauma management',
      'Pulp therapy',
    ],
    image: '/images/service-endodontics.jpg',
  },
  {
    id: 'prosthodontics',
    icon: FaTeeth,
    title: 'Prosthodontics',
    description: 'Restore function and aesthetics with our comprehensive prosthetic dental solutions.',
    features: [
      'Dental crowns and bridges',
      'Complete dentures',
      'Partial dentures',
      'Implant-supported prosthetics',
      'Full mouth rehabilitation',
    ],
    image: '/images/service-prosthodontics.jpg',
  },
  {
    id: 'periodontics',
    icon: FaTint,
    title: 'Periodontics',
    description: 'Specialized care for your gums and supporting structures to maintain a healthy foundation for your teeth.',
    features: [
      'Scaling and root planing',
      'Gum grafting',
      'Crown lengthening',
      'Pocket reduction surgery',
      'Dental implants',
    ],
    image: '/images/service-periodontics.jpg',
  },
];

export default function ServicesPage() {
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
              Our Dental Services
            </h1>
            <p className="text-xl text-primary-200">
              Comprehensive dental care for the whole family, from routine checkups 
              to advanced treatments, delivered with expertise and compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                    <service.icon className="w-16 h-16 text-primary-400" />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-neutral-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiCheck className="w-4 h-4 text-accent-600" />
                        </div>
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/appointments/book" className="btn-primary">
                    Book an Appointment
                    <FiArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Need Help Choosing a Treatment?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Our experienced dental team is here to help you find the best treatment 
            option for your needs. Schedule a consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointments/book" className="btn-white">
              Schedule Consultation
            </Link>
            <Link href="/contact" className="btn bg-accent-500 text-white hover:bg-accent-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
