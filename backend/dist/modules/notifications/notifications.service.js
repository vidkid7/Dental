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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let NotificationsService = class NotificationsService {
    constructor(configService) {
        this.configService = configService;
        this.emailTransporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST', 'localhost'),
            port: this.configService.get('SMTP_PORT', 1025),
            auth: this.configService.get('SMTP_USER')
                ? {
                    user: this.configService.get('SMTP_USER'),
                    pass: this.configService.get('SMTP_PASS'),
                }
                : undefined,
        });
    }
    async sendEmail(to, subject, html) {
        try {
            await this.emailTransporter.sendMail({
                from: this.configService.get('SMTP_FROM', 'noreply@premierdentalcollege.edu'),
                to,
                subject,
                html,
            });
            console.log(`Email sent to ${to}`);
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
    async sendSMS(phone, message) {
        const provider = this.configService.get('SMS_PROVIDER', 'mock');
        if (provider === 'mock') {
            console.log(`[MOCK SMS] To: ${phone}, Message: ${message}`);
            return;
        }
        throw new Error('SMS provider not configured');
    }
    async sendWhatsApp(phone, message) {
        const provider = this.configService.get('WHATSAPP_PROVIDER', 'mock');
        if (provider === 'mock') {
            console.log(`[MOCK WhatsApp] To: ${phone}, Message: ${message}`);
            return;
        }
        throw new Error('WhatsApp provider not configured');
    }
    getAppointmentConfirmationEmail(data) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0086c9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #0086c9; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${data.patientName},</p>
            <p>Your appointment has been booked successfully.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Doctor:</strong> ${data.doctorName}</li>
              <li><strong>Date:</strong> ${data.date}</li>
              <li><strong>Time:</strong> ${data.time}</li>
            </ul>
            <p>Please arrive 15 minutes before your scheduled appointment.</p>
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
          </div>
          <div class="footer">
            <p>Premier Dental College & Hospital</p>
            <p>123 Dental Avenue, Medical District | +1 (234) 567-890</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    getAdmissionConfirmationEmail(data) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0086c9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .highlight { background: #e8f4fc; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for applying to Premier Dental College!</p>
            <div class="highlight">
              <p><strong>Application Number:</strong> ${data.applicationNumber}</p>
              <p><strong>Program:</strong> ${data.programName}</p>
            </div>
            <p>Your application has been received and is under review. You can track your application status using your application number.</p>
            <p>We will notify you via email about the status of your application.</p>
          </div>
          <div class="footer">
            <p>Premier Dental College & Hospital</p>
            <p>Admissions Office | admissions@premierdentalcollege.edu</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map