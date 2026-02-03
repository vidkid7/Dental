import { ChatbotService } from './chatbot.service';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    chat(body: {
        message: string;
        history?: {
            role: 'user' | 'assistant';
            content: string;
        }[];
    }): Promise<{
        response: string;
    }>;
    getQuickResponses(): Promise<{
        question: string;
        answer: string;
    }[]>;
    getSystemPrompt(): {
        prompt: string;
    };
    updateSystemPrompt(body: {
        prompt: string;
    }): {
        message: string;
    };
}
