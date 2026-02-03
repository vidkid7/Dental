import { ConfigService } from '@nestjs/config';
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class ChatbotService {
    private configService;
    private openai;
    private systemPrompt;
    constructor(configService: ConfigService);
    chat(message: string, conversationHistory?: ChatMessage[]): Promise<string>;
    getQuickResponses(): Promise<{
        question: string;
        answer: string;
    }[]>;
    updateSystemPrompt(newPrompt: string): void;
    getSystemPrompt(): string;
}
export {};
