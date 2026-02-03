import { Job } from 'bull';
import { NotificationsService } from './notifications.service';
export declare class NotificationsProcessor {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    handleAppointmentConfirmation(job: Job): Promise<void>;
    handleAppointmentConfirmed(job: Job): Promise<void>;
    handleAppointmentReminder(job: Job): Promise<void>;
    handleAdmissionSubmitted(job: Job): Promise<void>;
    handleAdmissionStatusUpdate(job: Job): Promise<void>;
    handleNewEnquiry(job: Job): Promise<void>;
    handleEnquiryResponse(job: Job): Promise<void>;
}
