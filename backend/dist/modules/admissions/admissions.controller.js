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
exports.AdmissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admissions_service_1 = require("./admissions.service");
const create_admission_dto_1 = require("./dto/create-admission.dto");
const update_admission_dto_1 = require("./dto/update-admission.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const admission_entity_1 = require("./entities/admission.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let AdmissionsController = class AdmissionsController {
    constructor(admissionsService) {
        this.admissionsService = admissionsService;
    }
    create(createAdmissionDto) {
        return this.admissionsService.create(createAdmissionDto);
    }
    findAll(paginationDto, status, programId) {
        return this.admissionsService.findAll({ ...paginationDto, status, programId });
    }
    findOne(id) {
        return this.admissionsService.findOne(id);
    }
    track(applicationNumber) {
        return this.admissionsService.findByApplicationNumber(applicationNumber);
    }
    update(id, updateAdmissionDto) {
        return this.admissionsService.update(id, updateAdmissionDto);
    }
    submit(id) {
        return this.admissionsService.submit(id);
    }
    updateStatus(id, updateStatusDto) {
        return this.admissionsService.updateStatus(id, updateStatusDto.status, updateStatusDto.remarks);
    }
    addDocument(id, document) {
        return this.admissionsService.addDocument(id, document);
    }
    remove(id) {
        return this.admissionsService.remove(id);
    }
};
exports.AdmissionsController = AdmissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new admission application' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admission_dto_1.CreateAdmissionDto]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admission applications' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: admission_entity_1.ApplicationStatus }),
    (0, swagger_1.ApiQuery)({ name: 'programId', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get an application by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('track/:applicationNumber'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Track application by application number' }),
    __param(0, (0, common_1.Param)('applicationNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "track", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update an application' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admission_dto_1.UpdateAdmissionDto]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/submit'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an application' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "submit", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add document to application' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an application' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionsController.prototype, "remove", null);
exports.AdmissionsController = AdmissionsController = __decorate([
    (0, swagger_1.ApiTags)('admissions'),
    (0, common_1.Controller)('admissions'),
    __metadata("design:paramtypes", [admissions_service_1.AdmissionsService])
], AdmissionsController);
//# sourceMappingURL=admissions.controller.js.map