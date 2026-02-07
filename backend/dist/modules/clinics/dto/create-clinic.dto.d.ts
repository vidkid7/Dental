declare class WorkingHoursDto {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}
export declare class CreateClinicDto {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    workingHours?: WorkingHoursDto[];
    services?: string[];
    images?: string[];
    isMain?: boolean;
    isActive?: boolean;
}
export {};
