'use client';

import { useState, useEffect } from 'react';
import { get } from '@/lib/api';

interface Settings {
  siteName?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  weekdayHours?: string;
  saturdayHours?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

const defaultSettings: Settings = {
  siteName: 'Om Chabahil Dental Hospital',
  tagline: 'Your Smile, Our Priority',
  phone: '+977 9841-234567',
  whatsapp: '+977 9841234567',
  email: 'info@omchabahildental.com.np',
  address: 'Chabahil, Koteshwor, Kathmandu, Nepal',
  weekdayHours: 'Sunday - Friday: 9:00 AM - 6:00 PM',
  saturdayHours: 'Saturday: 9:00 AM - 4:00 PM',
  facebook: 'https://facebook.com/omchabahildental',
  instagram: 'https://instagram.com/omchabahildental',
  twitter: 'https://twitter.com/omchabahildental',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await get<Record<string, string>>('settings/object');
        
        if (data && Object.keys(data).length > 0) {
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings');
        // Keep using defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
