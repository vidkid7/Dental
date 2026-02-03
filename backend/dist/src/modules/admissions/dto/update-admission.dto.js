"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdmissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_admission_dto_1 = require("./create-admission.dto");
class UpdateAdmissionDto extends (0, swagger_1.PartialType)(create_admission_dto_1.CreateAdmissionDto) {
}
exports.UpdateAdmissionDto = UpdateAdmissionDto;
//# sourceMappingURL=update-admission.dto.js.map