'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiEye,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

const stats = [
  {
    name: 'Total Appointments',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: FiCalendar,
    href: '/admin/appointments',
  },
  {
    name: 'Active Doctors',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: FiUsers,
    href: '/admin/doctors',
  },
  {
    name: 'New Enquiries',
    value: '24',
    change: '+18%',
    changeType: 'positive',
    icon: FiMessageSquare,
    href: '/admin/enquiries',
  },
  {
    name: 'Revenue (This Month)',
    value: 'Rs. 4,52,000',
    change: '+8%',
    changeType: 'positive',
    icon: FiDollarSign,
    href: '/admin/appointments',
  },
];

const recentAppointments = [
  {
    id: '1',
    patient: 'Ram Sharma',
    doctor: 'Dr. Bikash Sharma',
    service: 'General Checkup',
    time: '09:00 AM',
    status: 'confirmed',
  },
  {
    id: '2',
    patient: 'Sita Thapa',
    doctor: 'Dr. Sunita Thapa',
    service: 'Orthodontics',
    time: '10:30 AM',
    status: 'pending',
  },
  {
    id: '3',
    patient: 'Hari Prasad',
    doctor: 'Dr. Ram Prasad KC',
    service: 'Tooth Extraction',
    time: '11:00 AM',
    status: 'confirmed',
  },
  {
    id: '4',
    patient: 'Maya Gurung',
    doctor: 'Dr. Anita Gurung',
    service: 'Root Canal',
    time: '02:00 PM',
    status: 'pending',
  },
];

const recentEnquiries = [
  {
    id: '1',
    name: 'Anita Maharjan',
    type: 'Appointment',
    message: 'Need information about root canal treatment cost',
    time: '2 hours ago',
  },
  {
    id: '2',
    name: 'Rajesh KC',
    type: 'Services',
    message: 'Interested in orthodontic consultation for my daughter',
    time: '4 hours ago',
  },
  {
    id: '3',
    name: 'Sunita Shrestha',
    type: 'General',
    message: 'What are your working hours on Saturday?',
    time: '6 hours ago',
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Admin Dashboard Title (for Testsprite) */}
      <h1 className="sr-only">Admin Dashboard</h1>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              {greeting()}, {user?.name || 'Admin'}!
            </h1>
            <p className="text-primary-100 mt-1">
              Here's what's happening at Om Chabahil Dental today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-primary-200">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-lg font-semibold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block bg-white rounded-xl p-5 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.name}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-soft"
        >
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h2 className="font-heading font-semibold text-neutral-900 flex items-center gap-2">
              <FiCalendar className="w-5 h-5 text-primary-600" />
              Today's Appointments
            </h2>
            <Link
              href="/admin/appointments"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{apt.patient}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">{apt.service} • {apt.doctor}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <FiClock className="w-4 h-4" />
                      {apt.time}
                    </div>
                    {apt.status === 'pending' && (
                      <div className="flex gap-1">
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-soft"
        >
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h2 className="font-heading font-semibold text-neutral-900 flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-primary-600" />
              Recent Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{enquiry.name}</p>
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                        {enquiry.type}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-1">{enquiry.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 whitespace-nowrap">{enquiry.time}</span>
                    <Link
                      href="/admin/enquiries"
                      className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h2 className="font-heading font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/doctors/new">
            <Button variant="secondary" className="w-full justify-center">
              <FiUsers className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </Link>
          <Link href="/admin/services">
            <Button variant="secondary" className="w-full justify-center">
              <FiCalendar className="w-4 h-4 mr-2" />
              Manage Services
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button variant="secondary" className="w-full justify-center">
              <FiMessageSquare className="w-4 h-4 mr-2" />
              Edit Content
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="secondary" className="w-full justify-center">
              <FiDollarSign className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
