"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const notifications_service_1 = require("./notifications.service");
let NotificationsProcessor = class NotificationsProcessor {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async handleAppointmentConfirmation(job) {
        const { patientEmail, patientPhone, doctorName, date, time, patientName } = job.data;
        const emailHtml = this.notificationsService.getAppointmentConfirmationEmail({
            patientName: patientName || 'Patient',
            doctorName,
            date,
            time,
        });
        await this.notificationsService.sendEmail(patientEmail, 'Appointment Confirmation', emailHtml);
        const smsMessage = `Your appointment with ${doctorName} is confirmed for ${date} at ${time}. - Premier Dental College`;
        await this.notificationsService.sendSMS(patientPhone, smsMessage);
    }
    async handleAppointmentConfirmed(job) {
        const { patientEmail, patientPhone } = job.data;
        await this.notificationsService.sendEmail(patientEmail, 'Appointment Confirmed', '<p>Your appointment has been confirmed by our staff. See you soon!</p>');
        await this.notificationsService.sendSMS(patientPhone, 'Your appointment has been confirmed. See you soon! - Premier Dental College');
    }
    async handleAppointmentReminder(job) {
        const { patientEmail, patientPhone, doctorName, date, time } = job.data;
        await this.notificationsService.sendEmail(patientEmail, 'Appointment Reminder', `<p>Reminder: You have an appointment with ${doctorName} tomorrow at ${time}.</p>`);
        await this.notificationsService.sendSMS(patientPhone, `Reminder: Your appointment with ${doctorName} is tomorrow at ${time}. - Premier Dental College`);
    }
    async handleAdmissionSubmitted(job) {
        const { email, name, applicationNumber, programName } = job.data;
        const emailHtml = this.notificationsService.getAdmissionConfirmationEmail({
            name,
            applicationNumber,
            programName: programName || 'the program',
        });
        await this.notificationsService.sendEmail(email, 'Application Received', emailHtml);
    }
    async handleAdmissionStatusUpdate(job) {
        const { email, name, applicationNumber, status } = job.data;
        await this.notificationsService.sendEmail(email, 'Application Status Update', `<p>Dear ${name},</p>
       <p>Your application (${applicationNumber}) status has been updated to: <strong>${status}</strong></p>
       <p>Please log in to your account to view more details.</p>`);
    }
    async handleNewEnquiry(job) {
        const { type, name, email, subject } = job.data;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@premierdentalcollege.edu';
        await this.notificationsService.sendEmail(adminEmail, `New ${type} Enquiry: ${subject}`, `<p>New enquiry received from ${name} (${email})</p>
       <p>Type: ${type}</p>
       <p>Subject: ${subject}</p>`);
    }
    async handleEnquiryResponse(job) {
        const { email, name, response } = job.data;
        await this.notificationsService.sendEmail(email, 'Response to Your Enquiry', `<p>Dear ${name},</p>
       <p>Thank you for contacting Premier Dental College. Here is our response:</p>
       <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
         ${response}
       </div>
       <p>If you have any further questions, please don't hesitate to reach out.</p>`);
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
__decorate([
    (0, bull_1.Process)('appointment-confirmation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAppointmentConfirmation", null);
__decorate([
    (0, bull_1.Process)('appointment-confirmed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAppointmentConfirmed", null);
__decorate([
    (0, bull_1.Process)('appointment-reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAppointmentReminder", null);
__decorate([
    (0, bull_1.Process)('admission-submitted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAdmissionSubmitted", null);
__decorate([
    (0, bull_1.Process)('admission-status-update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAdmissionStatusUpdate", null);
__decorate([
    (0, bull_1.Process)('new-enquiry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleNewEnquiry", null);
__decorate([
    (0, bull_1.Process)('enquiry-response'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleEnquiryResponse", null);
exports.NotificationsProcessor = NotificationsProcessor = __decorate([
    (0, bull_1.Processor)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map