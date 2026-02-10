'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';
import { post, get, getErrorMessage } from '@/lib/api';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  imageUrl?: string;
  department?: {
    name: string;
  };
}

interface DoctorWithAvailability extends Doctor {
  isAvailable: boolean;
  nextAvailableSlots?: string[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

type Step = 1 | 2 | 3 | 4;

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [allDoctors, setAllDoctors] = useState<DoctorWithAvailability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Form data
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  // Fetch all doctors with availability status when date and time are selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchAllDoctorsWithAvailability();
    }
  }, [selectedDate, selectedTime]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    try {
      setLoadingSlots(true);
      const response = await get<string[]>('doctors/booking/available-slots', {
        params: { date: selectedDate },
      });
      setAvailableSlots(response || []);
      if (!response || response.length === 0) {
        toast.error('No available slots for this date');
      }
    } catch (error) {
      console.error('Failed to load available slots', error);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchAllDoctorsWithAvailability = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setLoadingDoctors(true);
      
      // Fetch all doctors
      const allDoctorsResponse = await get<any>('doctors', {
        params: { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' },
      });
      const doctors: Doctor[] = allDoctorsResponse.data || [];

      // Fetch available doctors for selected time
      const availableDoctorsResponse = await get<Doctor[]>('appointments/available-doctors', {
        params: { date: selectedDate, time: selectedTime },
      });
      const availableDoctorIds = new Set(availableDoctorsResponse.map((d: Doctor) => d.id));

      // For each doctor, check their availability
      const doctorsWithAvailability: DoctorWithAvailability[] = await Promise.all(
        doctors.map(async (doctor) => {
          const isAvailable = availableDoctorIds.has(doctor.id);
          
          let nextAvailableSlots: string[] = [];
          if (!isAvailable) {
            // Fetch doctor's available slots for the selected date
            try {
              const slots = await get<TimeSlot[]>(`doctors/${doctor.id}/slots`, {
                params: { date: selectedDate },
              });
              nextAvailableSlots = slots.map((s) => s.startTime).slice(0, 3); // Show first 3 slots
            } catch (error) {
              console.error(`Failed to fetch slots for doctor ${doctor.id}`, error);
            }
          }

          return {
            ...doctor,
            isAvailable,
            nextAvailableSlots,
          };
        })
      );

      setAllDoctors(doctorsWithAvailability);
    } catch (error) {
      console.error('Failed to load doctors', error);
      toast.error('Failed to load doctors');
      setAllDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDoctorClick = (doctor: DoctorWithAvailability) => {
    if (!doctor.isAvailable) {
      if (doctor.nextAvailableSlots && doctor.nextAvailableSlots.length > 0) {
        toast.error(
          `${doctor.name} is not available at ${selectedTime}. Available times on ${selectedDate}: ${doctor.nextAvailableSlots.join(', ')}`,
          { duration: 5000 }
        );
      } else {
        toast.error(
          `${doctor.name} is not available on ${selectedDate}. Please select another date or doctor.`,
          { duration: 4000 }
        );
      }
      return;
    }
    setSelectedDoctor(doctor);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !patientName || !patientEmail || !patientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await post('appointments', {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        startTime: selectedTime,
        patientName,
        patientEmail,
        patientPhone,
        notes,
      });

      toast.success('Appointment booked successfully!');
      setCurrentStep(4);
    } catch (error) {
      console.error('Failed to book appointment', error);
      toast.error(getErrorMessage(error) || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!selectedDate || !selectedTime)) {
      toast.error('Please select date and time');
      return;
    }
    if (currentStep === 2 && !selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const getMinDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
  };

  const getMaxDate = () => {
    return format(addDays(new Date(), 90), 'yyyy-MM-dd');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
            Book an Appointment
          </h1>
          <p className="text-primary-100 text-lg">
            Schedule your visit with our expert dental team
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="flex justify-center items-center gap-8">
            {[
              { step: 1, label: 'Choose Date & Time' },
              { step: 2, label: 'Select Doctor' },
              { step: 3, label: 'Your Details' },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= item.step
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStep > item.step ? <FiCheck /> : item.step}
                </div>
                <span
                  className={`hidden md:block font-medium ${
                    currentStep >= item.step ? 'text-primary-600' : 'text-neutral-500'
                  }`}
                >
                  {item.label}
                </span>
                {index < 2 && (
                  <FiArrowRight
                    className={`hidden md:block ml-6 ${
                      currentStep > item.step ? 'text-primary-600' : 'text-neutral-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-4xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Select Date & Time */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                  Choose Date & Time
                </h2>
                
                {/* Calendar-Style Date Picker */}
                <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-4">
                      Select Date
                    </label>
                    
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                        disabled={isBefore(addDays(currentWeekStart, -7), startOfDay(new Date()))}
                        className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous week"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                      </button>
                      <span className="font-medium text-neutral-900">
                        {format(currentWeekStart, 'MMMM yyyy')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                        disabled={currentWeekStart > addDays(new Date(), 83)}
                        className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next week"
                      >
                        <FiArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Day Headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                          {day}
                        </div>
                      ))}
                      
                      {/* Date Buttons */}
                      {eachDayOfInterval({
                        start: currentWeekStart,
                        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
                      }).map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isPast = isBefore(day, startOfDay(new Date()));
                        const isTooFar = day > addDays(new Date(), 90);
                        const isDisabled = isPast || isTooFar;
                        const isSelected = selectedDate === dateStr;
                        const isTodayDate = isToday(day);

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedDate(dateStr);
                                setSelectedTime('');
                                setSelectedDoctor(null);
                              }
                            }}
                            disabled={isDisabled}
                            className={`
                              aspect-square p-2 rounded-lg text-sm font-medium transition-all
                              ${isSelected
                                ? 'bg-primary-600 text-white shadow-md scale-105'
                                : isTodayDate
                                ? 'bg-primary-50 text-primary-700 border-2 border-primary-300'
                                : isDisabled
                                ? 'text-neutral-300 cursor-not-allowed'
                                : 'bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                              }
                            `}
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <span>{format(day, 'd')}</span>
                              {isTodayDate && !isSelected && (
                                <span className="text-[8px] mt-0.5">Today</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-xs text-neutral-500 mt-4 text-center">
                      Select a date within the next 90 days
                    </p>
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        Available Time Slots
                      </label>
                      {loadingSlots ? (
                        <div className="text-center py-8 text-neutral-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                          Loading available slots...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-8 bg-neutral-50 rounded-lg">
                          <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                          <p className="text-neutral-500 text-sm">No available slots for this date</p>
                          <p className="text-neutral-400 text-xs mt-1">Please select another date</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                                selectedTime === time
                                  ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                                  : 'border-neutral-200 bg-white hover:border-primary-400 hover:bg-primary-50'
                              }`}
                            >
                              <FiClock className={`w-4 h-4 mx-auto mb-1 ${selectedTime === time ? 'text-white' : 'text-neutral-500'}`} />
                              <span className="text-sm font-medium">{time}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedDate && selectedTime && (
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-900">
                          {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')} at {selectedTime}
                        </p>
                        <p className="text-xs text-primary-700 mt-1">
                          Click "Next" to see available doctors for this time slot
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Doctor */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                  Select a Doctor
                </h2>
                
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-200 mb-6">
                  <p className="text-sm text-primary-900">
                    <strong>Selected Time:</strong> {selectedDate} at {selectedTime}
                  </p>
                  <p className="text-xs text-primary-700 mt-1">
                    Green border = Available | Gray = Not available at this time
                  </p>
                </div>

                {loadingDoctors ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-neutral-500">Loading doctors...</p>
                  </div>
                ) : allDoctors.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-soft">
                    <FiUser className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-2">No doctors found</p>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setSelectedTime('');
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      ← Choose a different time
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {allDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleDoctorClick(doctor)}
                        disabled={!doctor.isAvailable}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-primary-600 bg-primary-50'
                            : doctor.isAvailable
                            ? 'border-green-300 bg-white hover:border-green-500 hover:shadow-md'
                            : 'border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        {/* Availability Badge */}
                        <div className="absolute top-2 right-2">
                          {doctor.isAvailable ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded-full">
                              Not Available
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-4 mt-6">
                          {doctor.imageUrl && (
                            <img
                              src={doctor.imageUrl}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className={`font-semibold ${doctor.isAvailable ? 'text-neutral-900' : 'text-neutral-500'}`}>
                              {doctor.name}
                            </h3>
                            <p className={`text-sm ${doctor.isAvailable ? 'text-neutral-600' : 'text-neutral-400'}`}>
                              {doctor.specialization}
                            </p>
                            <p className={`text-xs mt-1 ${doctor.isAvailable ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {doctor.qualification}
                            </p>
                            {doctor.department && (
                              <p className={`text-xs mt-1 ${doctor.isAvailable ? 'text-primary-600' : 'text-neutral-400'}`}>
                                {doctor.department.name}
                              </p>
                            )}
                            
                            {/* Show available times for unavailable doctors */}
                            {!doctor.isAvailable && doctor.nextAvailableSlots && doctor.nextAvailableSlots.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-neutral-200">
                                <p className="text-xs text-neutral-600 font-medium">Available today at:</p>
                                <p className="text-xs text-primary-600 mt-1">
                                  {doctor.nextAvailableSlots.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <FiCheck className="text-primary-600 w-6 h-6 absolute bottom-4 right-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Summary of available doctors */}
                {allDoctors.length > 0 && (
                  <div className="mt-6 text-center text-sm text-neutral-600">
                    {allDoctors.filter(d => d.isAvailable).length} of {allDoctors.length} doctors available at {selectedTime}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Patient Details */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                  Your Details
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-soft space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter your full name"
                      leftIcon={<FiUser />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      leftIcon={<FiMail />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+977 9841234567"
                      leftIcon={<FiPhone />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific concerns or requirements..."
                      rows={4}
                    />
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Doctor:</strong> {selectedDoctor?.name}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
                  Appointment Booked Successfully!
                </h2>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  Your appointment has been confirmed. We've sent a confirmation email to{' '}
                  <strong>{patientEmail}</strong>
                </p>
                <div className="bg-white rounded-xl p-6 shadow-soft max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-neutral-900 mb-4">Appointment Details</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Doctor:</span>
                      <span className="font-medium">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Patient:</span>
                      <span className="font-medium">{patientName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/')} variant="secondary">
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setSelectedDate('');
                      setSelectedTime('');
                      setSelectedDoctor(null);
                      setPatientName('');
                      setPatientEmail('');
                      setPatientPhone('');
                      setNotes('');
                    }}
                  >
                    Book Another Appointment
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <FiArrowLeft />
                Previous
              </Button>
              {currentStep < 3 ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <FiArrowRight />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                  <FiCheck />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
