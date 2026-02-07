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
exports.AcademicProgram = exports.ProgramType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
var ProgramType;
(function (ProgramType) {
    ProgramType["BDS"] = "bds";
    ProgramType["MDS"] = "mds";
    ProgramType["INTERNSHIP"] = "internship";
    ProgramType["CERTIFICATE"] = "certificate";
})(ProgramType || (exports.ProgramType = ProgramType = {}));
let AcademicProgram = class AcademicProgram extends base_entity_1.BaseEntity {
};
exports.AcademicProgram = AcademicProgram;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AcademicProgram.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProgramType,
    }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AcademicProgram.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "eligibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "curriculum", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "fees", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AcademicProgram.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AcademicProgram.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], AcademicProgram.prototype, "isActive", void 0);
exports.AcademicProgram = AcademicProgram = __decorate([
    (0, typeorm_1.Entity)('academic_programs')
], AcademicProgram);
//# sourceMappingURL=program.entity.js.map