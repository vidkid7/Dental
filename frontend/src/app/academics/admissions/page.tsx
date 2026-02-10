'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiFile, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

const admissionSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  address: z.string().min(10, 'Complete address is required'),
  
  // Academic Information
  programId: z.string().min(1, 'Please select a program'),
  previousEducation: z.string().min(2, 'Previous education is required'),
  percentage: z.string().min(1, 'Percentage is required'),
  passingYear: z.string().min(4, 'Passing year is required'),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const programs = [
  { value: 'bds', label: 'Bachelor of Dental Surgery (BDS)' },
  { value: 'mds-orthodontics', label: 'MDS - Orthodontics' },
  { value: 'mds-oral-surgery', label: 'MDS - Oral Surgery' },
  { value: 'mds-prosthodontics', label: 'MDS - Prosthodontics' },
  { value: 'mds-endodontics', label: 'MDS - Endodontics' },
  { value: 'mds-periodontics', label: 'MDS - Periodontics' },
  { value: 'mds-pedodontics', label: 'MDS - Pedodontics' },
];

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

interface UploadedFile {
  type: string;
  name: string;
  url: string;
}

export default function AdmissionsPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [applicationComplete, setApplicationComplete] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const validateStep = async () => {
    let fieldsToValidate: (keyof AdmissionFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'nationality', 'address'];
    } else if (step === 2) {
      fieldsToValidate = ['programId', 'previousEducation', 'percentage', 'passingYear'];
    }
    
    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement actual file upload to Cloudinary
      const fakeUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => [
        ...prev.filter((f) => f.type !== type),
        { type, name: file.name, url: fakeUrl },
      ]);
      toast.success(`${type} uploaded successfully`);
    }
  };

  const removeFile = (type: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.type !== type));
  };

  const onSubmit = async (data: AdmissionFormData) => {
    if (uploadedFiles.length < 3) {
      toast.error('Please upload all required documents');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call
      console.log({ ...data, documents: uploadedFiles });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock response
      setApplicationNumber('PDC-2024-00001');
      setApplicationComplete(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (applicationComplete) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-neutral-600 mb-4">
            Your application has been successfully submitted. Your application number is:
          </p>
          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-2xl font-bold text-primary-600">{applicationNumber}</p>
          </div>
          <p className="text-sm text-neutral-500 mb-8">
            Please save this number for tracking your application status. A confirmation 
            email has been sent to your registered email address.
          </p>
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
            Online Admission Application
          </h1>
          <p className="text-primary-200">
            Apply for BDS, MDS, and other dental programs
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { num: 1, label: 'Personal Info' },
              { num: 2, label: 'Academic Info' },
              { num: 3, label: 'Documents' },
              { num: 4, label: 'Review' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s.num
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {step > s.num ? <FiCheck className="w-5 h-5" /> : s.num}
                </div>
                <span className={`ml-2 hidden md:inline text-sm ${step >= s.num ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {s.label}
                </span>
                {index < 3 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-primary-600' : 'bg-neutral-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                      Personal Information
                    </h2>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="First Name"
                          placeholder="John"
                          error={errors.firstName?.message}
                          {...register('firstName')}
                          required
                        />
                        <Input
                          label="Last Name"
                          placeholder="Doe"
                          error={errors.lastName?.message}
                          {...register('lastName')}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="john@example.com"
                          error={errors.email?.message}
                          {...register('email')}
                          required
                        />
                        <Input
                          label="Phone Number"
                          placeholder="0145-92100"
                          error={errors.phone?.message}
                          {...register('phone')}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Date of Birth"
                          type="date"
                          error={errors.dateOfBirth?.message}
                          {...register('dateOfBirth')}
                          required
                        />
                        <Select
                          label="Gender"
                          options={genders}
                          placeholder="Select gender"
                          error={errors.gender?.message}
                          {...register('gender')}
                          required
                        />
                      </div>
                      <Input
                        label="Nationality"
                        placeholder="American"
                        error={errors.nationality?.message}
                        {...register('nationality')}
                        required
                      />
                      <Textarea
                        label="Full Address"
                        placeholder="123 Main Street, City, State, Country, ZIP"
                        rows={3}
                        error={errors.address?.message}
                        {...register('address')}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Academic Information */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                      Academic Information
                    </h2>
                    <div className="space-y-6">
                      <Select
                        label="Program Applying For"
                        options={programs}
                        placeholder="Select program"
                        error={errors.programId?.message}
                        {...register('programId')}
                        required
                      />
                      <Input
                        label="Previous Education"
                        placeholder="e.g., 10+2 with Science, BDS"
                        error={errors.previousEducation?.message}
                        {...register('previousEducation')}
                        required
                      />
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Percentage/CGPA"
                          placeholder="85.5"
                          error={errors.percentage?.message}
                          {...register('percentage')}
                          required
                        />
                        <Input
                          label="Passing Year"
                          placeholder="2023"
                          error={errors.passingYear?.message}
                          {...register('passingYear')}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                      Upload Documents
                    </h2>
                    <div className="space-y-6">
                      {[
                        { type: 'Photo', label: 'Passport Size Photo', accept: 'image/*' },
                        { type: 'ID', label: 'Government ID (Passport/ID Card)', accept: '.pdf,image/*' },
                        { type: 'Certificate', label: 'Previous Education Certificate', accept: '.pdf,image/*' },
                        { type: 'Marksheet', label: 'Previous Marksheets', accept: '.pdf,image/*' },
                      ].map((doc) => {
                        const uploaded = uploadedFiles.find((f) => f.type === doc.type);
                        return (
                          <div key={doc.type} className="border border-neutral-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  uploaded ? 'bg-green-100' : 'bg-neutral-100'
                                }`}>
                                  {uploaded ? (
                                    <FiCheck className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <FiFile className="w-5 h-5 text-neutral-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-neutral-900">{doc.label}</p>
                                  {uploaded ? (
                                    <p className="text-sm text-green-600">{uploaded.name}</p>
                                  ) : (
                                    <p className="text-sm text-neutral-500">PDF or Image, max 5MB</p>
                                  )}
                                </div>
                              </div>
                              {uploaded ? (
                                <button
                                  type="button"
                                  onClick={() => removeFile(doc.type)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                  <FiX className="w-5 h-5" />
                                </button>
                              ) : (
                                <label className="btn-secondary btn-sm cursor-pointer">
                                  <FiUpload className="w-4 h-4 mr-2" />
                                  Upload
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept={doc.accept}
                                    onChange={(e) => handleFileUpload(e, doc.type)}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                      Review Your Application
                    </h2>
                    <div className="space-y-6">
                      {/* Personal Info Summary */}
                      <div className="bg-neutral-50 rounded-xl p-4">
                        <h3 className="font-semibold text-neutral-900 mb-3">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-neutral-500">Name</p>
                            <p className="text-neutral-900">{getValues('firstName')} {getValues('lastName')}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Email</p>
                            <p className="text-neutral-900">{getValues('email')}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Phone</p>
                            <p className="text-neutral-900">{getValues('phone')}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Date of Birth</p>
                            <p className="text-neutral-900">{getValues('dateOfBirth')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Academic Info Summary */}
                      <div className="bg-neutral-50 rounded-xl p-4">
                        <h3 className="font-semibold text-neutral-900 mb-3">Academic Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-neutral-500">Program</p>
                            <p className="text-neutral-900">
                              {programs.find(p => p.value === getValues('programId'))?.label}
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Previous Education</p>
                            <p className="text-neutral-900">{getValues('previousEducation')}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Percentage</p>
                            <p className="text-neutral-900">{getValues('percentage')}%</p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Passing Year</p>
                            <p className="text-neutral-900">{getValues('passingYear')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Documents Summary */}
                      <div className="bg-neutral-50 rounded-xl p-4">
                        <h3 className="font-semibold text-neutral-900 mb-3">Uploaded Documents</h3>
                        <div className="space-y-2">
                          {uploadedFiles.map((file) => (
                            <div key={file.type} className="flex items-center gap-2 text-sm">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-neutral-900">{file.type}: {file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">
                          Please review all information carefully before submitting. Once submitted, 
                          changes can only be made by contacting the admissions office.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              {step < 4 ? (
                <Button type="button" variant="primary" onClick={nextStep}>
                  Next
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
