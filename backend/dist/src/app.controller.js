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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AppController = class AppController {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getRoot() {
        return {
            name: 'Dental College API',
            version: '1.0',
            status: 'running',
            docs: '/docs',
            api: '/api/v1',
        };
    }
    async getHealth() {
        const dbOk = await this.checkDatabase();
        return {
            status: dbOk ? 'ok' : 'error',
            database: dbOk ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString(),
        };
    }
    async checkDatabase() {
        try {
            const result = await this.dataSource.query('SELECT 1 as ok');
            return Array.isArray(result) && result.length > 0 && (result[0]?.ok === 1 || result[0]?.ok === '1');
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppController);
//# sourceMappingURL=app.controller.js.map