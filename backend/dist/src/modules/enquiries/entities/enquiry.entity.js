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
exports.Enquiry = exports.EnquiryStatus = exports.EnquiryType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var EnquiryType;
(function (EnquiryType) {
    EnquiryType["GENERAL"] = "general";
    EnquiryType["APPOINTMENT"] = "appointment";
    EnquiryType["ADMISSION"] = "admission";
    EnquiryType["SERVICES"] = "services";
    EnquiryType["FEEDBACK"] = "feedback";
    EnquiryType["COMPLAINT"] = "complaint";
})(EnquiryType || (exports.EnquiryType = EnquiryType = {}));
var EnquiryStatus;
(function (EnquiryStatus) {
    EnquiryStatus["NEW"] = "new";
    EnquiryStatus["IN_PROGRESS"] = "in_progress";
    EnquiryStatus["RESOLVED"] = "resolved";
    EnquiryStatus["CLOSED"] = "closed";
})(EnquiryStatus || (exports.EnquiryStatus = EnquiryStatus = {}));
let Enquiry = class Enquiry extends base_entity_1.BaseEntity {
};
exports.Enquiry = Enquiry;
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EnquiryType,
        default: EnquiryType.GENERAL,
    }),
    __metadata("design:type", String)
], Enquiry.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Enquiry.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EnquiryStatus,
        default: EnquiryStatus.NEW,
    }),
    __metadata("design:type", String)
], Enquiry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_to', nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_to' }),
    __metadata("design:type", user_entity_1.User)
], Enquiry.prototype, "assignedUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responded_at', nullable: true }),
    __metadata("design:type", Date)
], Enquiry.prototype, "respondedAt", void 0);
exports.Enquiry = Enquiry = __decorate([
    (0, typeorm_1.Entity)('enquiries')
], Enquiry);
//# sourceMappingURL=enquiry.entity.js.map