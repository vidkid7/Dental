"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClinicDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_clinic_dto_1 = require("./create-clinic.dto");
class UpdateClinicDto extends (0, swagger_1.PartialType)(create_clinic_dto_1.CreateClinicDto) {
}
exports.UpdateClinicDto = UpdateClinicDto;
//# sourceMappingURL=update-clinic.dto.js.map