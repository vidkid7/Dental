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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let ChatbotService = class ChatbotService {
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
        this.systemPrompt = `You are a helpful assistant for Premier Dental College & Hospital. Your role is to help:
    
1. **Patients**: Answer questions about dental services, appointment booking, clinic timings, and general dental health queries.

2. **Students**: Provide information about academic programs (BDS, MDS), admissions process, eligibility criteria, fees, and campus facilities.

3. **General Visitors**: Share information about the institution, faculty, research activities, and contact details.

Guidelines:
- Be polite, professional, and empathetic
- Provide accurate information based on the context
- For appointment bookings, guide users to use the online booking system or call the reception
- For admissions, provide eligibility criteria and direct them to the admissions portal
- If you don't know something specific, suggest contacting the relevant department
- Keep responses concise but helpful
- Don't provide medical diagnosis or treatment advice - always recommend consulting a dentist

Contact Information:
- Phone: 0145-92100
- Email: Omchabahildental2075@gmail.com
- Address: Chabahil, Koteshwor, Kathmandu, Nepal

Working Hours:
- Monday to Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 4:00 PM
- Sunday: Emergency Only`;
    }
    async chat(message, conversationHistory = []) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...conversationHistory,
                { role: 'user', content: message },
            ];
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages,
                max_tokens: 500,
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";
        }
        catch (error) {
            console.error('Chatbot error:', error);
            return "I'm experiencing technical difficulties. Please try again later or contact us directly at 0145-92100.";
        }
    }
    async getQuickResponses() {
        return [
            {
                question: 'How do I book an appointment?',
                answer: 'You can book an appointment online through our website by clicking on "Book Appointment", or call us at 0145-92100.',
            },
            {
                question: 'What are the BDS admission requirements?',
                answer: 'For BDS admission, you need: 10+2 with Physics, Chemistry, Biology with minimum 50% marks, valid entrance exam score, and age between 17-25 years.',
            },
            {
                question: 'What are your working hours?',
                answer: 'We are open Monday-Friday 8:00 AM - 6:00 PM, Saturday 9:00 AM - 4:00 PM. Emergency services available on Sundays.',
            },
            {
                question: 'What dental services do you offer?',
                answer: 'We offer comprehensive dental services including general dentistry, orthodontics, oral surgery, pediatric dentistry, cosmetic dentistry, and more.',
            },
        ];
    }
    updateSystemPrompt(newPrompt) {
        this.systemPrompt = newPrompt;
    }
    getSystemPrompt() {
        return this.systemPrompt;
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map