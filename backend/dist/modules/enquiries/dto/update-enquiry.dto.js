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
exports.UpdateEnquiryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_enquiry_dto_1 = require("./create-enquiry.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const enquiry_entity_1 = require("../entities/enquiry.entity");
class UpdateEnquiryDto extends (0, swagger_1.PartialType)(create_enquiry_dto_1.CreateEnquiryDto) {
}
exports.UpdateEnquiryDto = UpdateEnquiryDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ enum: enquiry_entity_1.EnquiryStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enquiry_entity_1.EnquiryStatus),
    __metadata("design:type", String)
], UpdateEnquiryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateEnquiryDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEnquiryDto.prototype, "response", void 0);
//# sourceMappingURL=update-enquiry.dto.js.map