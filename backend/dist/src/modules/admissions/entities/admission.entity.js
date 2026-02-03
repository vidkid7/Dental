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
exports.AdmissionApplication = exports.Gender = exports.ApplicationStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const program_entity_1 = require("../../programs/entities/program.entity");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["DRAFT"] = "draft";
    ApplicationStatus["SUBMITTED"] = "submitted";
    ApplicationStatus["UNDER_REVIEW"] = "under_review";
    ApplicationStatus["SHORTLISTED"] = "shortlisted";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
let AdmissionApplication = class AdmissionApplication extends base_entity_1.BaseEntity {
};
exports.AdmissionApplication = AdmissionApplication;
__decorate([
    (0, typeorm_1.Column)({ name: 'application_number', unique: true }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "applicationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'program_id' }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => program_entity_1.AcademicProgram),
    (0, typeorm_1.JoinColumn)({ name: 'program_id' }),
    __metadata("design:type", program_entity_1.AcademicProgram)
], AdmissionApplication.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name' }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name' }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date' }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Gender,
    }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'previous_education' }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "previousEducation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], AdmissionApplication.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passing_year' }),
    __metadata("design:type", Number)
], AdmissionApplication.prototype, "passingYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], AdmissionApplication.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.DRAFT,
    }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AdmissionApplication.prototype, "remarks", void 0);
exports.AdmissionApplication = AdmissionApplication = __decorate([
    (0, typeorm_1.Entity)('admission_applications')
], AdmissionApplication);
//# sourceMappingURL=admission.entity.js.map