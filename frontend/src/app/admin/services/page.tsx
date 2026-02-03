'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, del, getErrorMessage } from '@/lib/api';

interface Service {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  isActive: boolean;
  price?: number;
  duration?: number;
  category?: string;
  // Optional fields we may not use directly in the UI
  order?: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; service: Service | null }>({
    open: false,
    service: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; service: Service | null }>({
    open: false,
    service: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });

  // Load services from API on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await get<Service[]>('services');
        // Map backend model into UI model (price/duration handled via description text for now)
        setServices(
          data.map((s) => ({
            id: s.id,
            name: s.name,
            shortDescription: s.shortDescription,
            description: s.description,
            isActive: s.isActive,
            order: s.order,
          })),
        );
      } catch (error) {
        console.error('Failed to load services', error);
        toast.error(getErrorMessage(error) || 'Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAddModal = () => {
    setFormData({ name: '', description: '', price: '', duration: '', category: '' });
    setEditModal({ open: true, service: null });
  };

  const openEditModal = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      // We don't persist price/duration yet in backend model; keep local-only
      price: '',
      duration: '',
      category: '',
    });
    setEditModal({ open: true, service });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      if (editModal.service) {
        // Update existing (backend)
        const payload = {
          name: formData.name,
          shortDescription: formData.description || editModal.service.shortDescription,
          description: formData.description || editModal.service.description,
        };
        const updated = await patch<Service>(`services/${editModal.service.id}`, payload);
        setServices(
          services.map((s) =>
            s.id === editModal.service!.id
              ? {
                  ...s,
                  name: updated.name,
                  shortDescription: updated.shortDescription,
                  description: updated.description,
                  isActive: updated.isActive,
                  order: updated.order,
                }
              : s,
          ),
        );
        toast.success('Service updated successfully');
      } else {
        // Add new (backend)
        const payload = {
          name: formData.name,
          shortDescription: formData.description || formData.name,
          description: formData.description || formData.name,
          isActive: true,
        };
        const created = await post<Service>('services', payload);
        setServices([
          ...services,
          {
            id: created.id,
            name: created.name,
            shortDescription: created.shortDescription,
            description: created.description,
            isActive: created.isActive,
            order: created.order,
          },
        ]);
        toast.success('Service added successfully');
      }
      setEditModal({ open: false, service: null });
    } catch (error) {
      console.error('Save service failed', error);
      toast.error(getErrorMessage(error) || 'Failed to save service');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.service) return;
    try {
      await del<void>(`services/${deleteModal.service.id}`);
      setServices(services.filter((s) => s.id !== deleteModal.service!.id));
      toast.success('Service deleted successfully');
      setDeleteModal({ open: false, service: null });
    } catch (error) {
      console.error('Delete service failed', error);
      toast.error(getErrorMessage(error) || 'Failed to delete service');
    }
  };

  const toggleActive = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!target) return;
    const nextIsActive = !target.isActive;
    try {
      const updated = await patch<Service>(`services/${id}`, { isActive: nextIsActive });
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, isActive: updated.isActive } : s,
        ),
      );
      toast.success('Service status updated');
    } catch (error) {
      console.error('Update status failed', error);
      toast.error(getErrorMessage(error) || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Services</h1>
          <p className="text-neutral-600 mt-1">Manage dental services and pricing</p>
        </div>
        <Button onClick={openAddModal}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search services..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-soft p-8 text-center text-neutral-500">
          Loading services...
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-soft p-6 ${!service.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading font-semibold text-lg text-neutral-900">{service.name}</h3>
                {service.category && (
                  <span className="text-sm text-primary-600">{service.category}</span>
                )}
              </div>
              <button
                onClick={() => toggleActive(service.id)}
                className={`p-2 rounded-lg transition-colors ${
                  service.isActive
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-neutral-400 hover:bg-neutral-100'
                }`}
                title={service.isActive ? 'Active' : 'Inactive'}
              >
                {service.isActive ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{service.description}</p>

            {(service.price || service.duration) && (
              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                {service.price && (
                  <span className="flex items-center gap-1">
                    <FiDollarSign className="w-4 h-4" />
                    Rs. {service.price.toLocaleString()}
                  </span>
                )}
                {service.duration && (
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    {service.duration} mins
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-neutral-100">
              <Button variant="ghost" size="sm" onClick={() => openEditModal(service)} className="flex-1">
                <FiEdit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteModal({ open: true, service })}
                className="text-red-600 hover:bg-red-50"
              >
                <FiTrash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {!isLoading && filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft">
          <p className="text-neutral-500">No services found</p>
        </div>
      )}

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, service: null })}
        title={editModal.service ? 'Edit Service' : 'Add New Service'}
      >
        <div className="p-6 space-y-4">
          <Input
            label="Service Name"
            placeholder="e.g., Teeth Cleaning"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Brief description of the service"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (Rs.)"
              type="number"
              placeholder="1500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Duration (mins)"
              type="number"
              placeholder="45"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          <Input
            label="Category"
            placeholder="e.g., General, Cosmetic, Surgery"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setEditModal({ open: false, service: null })}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editModal.service ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, service: null })}
        title="Delete Service"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{deleteModal.service?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, service: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
