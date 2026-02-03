'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { get, patch, post, del, getErrorMessage } from '@/lib/api';

interface DoctorForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee?: number;
  departmentId: string;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface DoctorAvailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(t: string): string {
  if (!t) return '--:--';
  return t.length > 5 ? t.substring(0, 5) : t;
}

export default function EditDoctorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<DoctorForm | null>(null);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingAvailability, setIsAddingAvailability] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [doctor, deptList, avail] = await Promise.all([
          get<DoctorForm>(`doctors/${params.id}`),
          get<DepartmentOption[]>('departments'),
          get<DoctorAvailability[]>(`doctors/${params.id}/availability`).catch(() => []),
        ]);
        setForm(doctor);
        setDepartments(deptList);
        setAvailabilities(Array.isArray(avail) ? avail : []);
      } catch (error) {
        console.error('Failed to load doctor data', error);
        toast.error(getErrorMessage(error) || 'Failed to load doctor data');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/admin/doctors')}>
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Button>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <p className="text-neutral-600">Loading doctor...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/admin/doctors')}>
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Button>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <p className="text-neutral-700 font-medium">Doctor not found.</p>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof DoctorForm, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSubmitting(true);

    try {
      await patch<DoctorForm, Partial<DoctorForm>>(`doctors/${form.id}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        qualification: form.qualification,
        specialization: form.specialization,
        experience: Number(form.experience) || 0,
        consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
        departmentId: form.departmentId,
      });
      toast.success('Doctor updated successfully');
      router.push('/admin/doctors');
    } catch (error) {
      console.error('Failed to update doctor', error);
      toast.error(getErrorMessage(error) || 'Failed to update doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAvailability = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsAddingAvailability(true);
    try {
      await post(`doctors/${form.id}/availability`, {
        dayOfWeek: newAvailability.dayOfWeek,
        startTime: newAvailability.startTime,
        endTime: newAvailability.endTime,
        slotDuration: newAvailability.slotDuration,
        isActive: true,
      });
      const avail = await get<DoctorAvailability[]>(`doctors/${form.id}/availability`);
      setAvailabilities(Array.isArray(avail) ? avail : []);
      setNewAvailability({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 30 });
      toast.success('Availability added');
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to add availability');
    } finally {
      setIsAddingAvailability(false);
    }
  };

  const handleRemoveAvailability = async (availabilityId: string) => {
    if (!form) return;
    try {
      await del(`doctors/${form.id}/availability/${availabilityId}`);
      setAvailabilities((prev) => prev.filter((a) => a.id !== availabilityId));
      toast.success('Availability removed');
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to remove availability');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-neutral-900">Edit Doctor</h1>
            <p className="text-neutral-600 text-sm">
              Update profile details for <span className="font-semibold">{form.name}</span>
            </p>
          </div>
        </div>
        <Link href="/admin/doctors">
          <Button variant="outline">View All Doctors</Button>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-soft p-6 space-y-6 max-w-3xl"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
          <Input
            label="Specialization"
            value={form.specialization}
            onChange={(e) => handleChange('specialization', e.target.value)}
            required
          />
          <Input
            label="Qualification"
            value={form.qualification}
            onChange={(e) => handleChange('qualification', e.target.value)}
            className="md:col-span-2"
          />
          <Select
            label="Department"
            options={departments.map((d) => ({ value: d.id, label: d.name }))}
            value={form.departmentId}
            onChange={(e) => handleChange('departmentId', e.target.value)}
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Experience (years)"
            type="number"
            min={0}
            value={form.experience}
            onChange={(e) => handleChange('experience', Number(e.target.value || 0))}
          />
          <Input
            label="Consultation Fee (Rs.)"
            type="number"
            min={0}
            value={form.consultationFee ?? 0}
            onChange={(e) => handleChange('consultationFee', Number(e.target.value || 0))}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/doctors')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Availability section */}
      <div className="bg-white rounded-xl shadow-soft p-6 max-w-3xl">
        <h2 className="text-lg font-heading font-semibold text-neutral-900 mb-2 flex items-center gap-2">
          <FiClock className="w-5 h-5 text-primary-600" />
          Available Days &amp; Times
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          Set which days and time slots this doctor is available. Patients can only book appointments within these slots.
        </p>

        {availabilities.length > 0 && (
          <ul className="space-y-2 mb-6">
            {availabilities
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-50 border border-neutral-100"
                >
                  <span className="font-medium text-neutral-800">{DAY_NAMES[a.dayOfWeek]}</span>
                  <span className="text-neutral-600 text-sm">
                    {formatTime(a.startTime)} – {formatTime(a.endTime)}
                    {a.slotDuration ? ` (${a.slotDuration} min slots)` : ''}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveAvailability(a.id)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
          </ul>
        )}

        <form onSubmit={handleAddAvailability} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/50 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-800">Add availability</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              label="Day"
              value={String(newAvailability.dayOfWeek)}
              onChange={(e) => setNewAvailability((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
              options={DAY_NAMES.map((name, i) => ({ value: String(i), label: name }))}
            />
            <Input
              label="Start time"
              type="time"
              value={newAvailability.startTime}
              onChange={(e) => setNewAvailability((prev) => ({ ...prev, startTime: e.target.value }))}
            />
            <Input
              label="End time"
              type="time"
              value={newAvailability.endTime}
              onChange={(e) => setNewAvailability((prev) => ({ ...prev, endTime: e.target.value }))}
            />
            <Input
              label="Slot (min)"
              type="number"
              min={10}
              max={60}
              value={newAvailability.slotDuration}
              onChange={(e) => setNewAvailability((prev) => ({ ...prev, slotDuration: Number(e.target.value) || 30 }))}
            />
          </div>
          <Button type="submit" disabled={isAddingAvailability} size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            {isAddingAvailability ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </div>
    </div>
  );
}

