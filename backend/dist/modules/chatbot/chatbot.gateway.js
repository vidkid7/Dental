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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chatbot_service_1 = require("./chatbot.service");
let ChatbotGateway = class ChatbotGateway {
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
        this.conversationHistories = new Map();
    }
    async handleMessage(data, client) {
        const history = this.conversationHistories.get(client.id) || [];
        const response = await this.chatbotService.chat(data.message, history);
        history.push({ role: 'user', content: data.message });
        history.push({ role: 'assistant', content: response });
        if (history.length > 20) {
            history.splice(0, 2);
        }
        this.conversationHistories.set(client.id, history);
        client.emit('response', { message: response });
    }
    handleClearHistory(client) {
        this.conversationHistories.delete(client.id);
        client.emit('historyCleared');
    }
    handleDisconnect(client) {
        this.conversationHistories.delete(client.id);
    }
};
exports.ChatbotGateway = ChatbotGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatbotGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatbotGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('clearHistory'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatbotGateway.prototype, "handleClearHistory", null);
exports.ChatbotGateway = ChatbotGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'chatbot',
    }),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService])
], ChatbotGateway);
//# sourceMappingURL=chatbot.gateway.js.map