import { Server, Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
export declare class ChatbotGateway {
    private chatbotService;
    server: Server;
    private conversationHistories;
    constructor(chatbotService: ChatbotService);
    handleMessage(data: {
        message: string;
    }, client: Socket): Promise<void>;
    handleClearHistory(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
