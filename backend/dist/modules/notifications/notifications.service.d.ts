import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private emailTransporter;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendSMS(phone: string, message: string): Promise<void>;
    sendWhatsApp(phone: string, message: string): Promise<void>;
    getAppointmentConfirmationEmail(data: {
        patientName: string;
        doctorName: string;
        date: string;
        time: string;
    }): string;
    getAdmissionConfirmationEmail(data: {
        name: string;
        applicationNumber: string;
        programName: string;
    }): string;
}
