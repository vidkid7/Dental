import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class ChatbotService {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
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
- Phone: +1 (234) 567-890
- Email: info@premierdentalcollege.edu
- Address: 123 Dental Avenue, Medical District

Working Hours:
- Monday to Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 4:00 PM
- Sunday: Emergency Only`;
  }

  async chat(
    message: string,
    conversationHistory: ChatMessage[] = [],
  ): Promise<string> {
    try {
      const messages: ChatMessage[] = [
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
    } catch (error) {
      console.error('Chatbot error:', error);
      return "I'm experiencing technical difficulties. Please try again later or contact us directly at +1 (234) 567-890.";
    }
  }

  async getQuickResponses(): Promise<{ question: string; answer: string }[]> {
    return [
      {
        question: 'How do I book an appointment?',
        answer: 'You can book an appointment online through our website by clicking on "Book Appointment", or call us at +1 (234) 567-890.',
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

  updateSystemPrompt(newPrompt: string): void {
    this.systemPrompt = newPrompt;
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}
