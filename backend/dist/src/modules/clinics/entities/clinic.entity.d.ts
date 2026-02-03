import { BaseEntity } from '@/common/entities/base.entity';
export declare class Clinic extends BaseEntity {
    name: string;
    slug: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    workingHours: {
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
        isClosed: boolean;
    }[];
    services?: string[];
    images?: string[];
    isMain: boolean;
    isActive: boolean;
}
