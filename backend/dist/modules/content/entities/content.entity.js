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
exports.PageContent = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
let PageContent = class PageContent extends base_entity_1.BaseEntity {
};
exports.PageContent = PageContent;
__decorate([
    (0, typeorm_1.Column)({ name: 'page_slug' }),
    __metadata("design:type", String)
], PageContent.prototype, "pageSlug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section_key' }),
    __metadata("design:type", String)
], PageContent.prototype, "sectionKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], PageContent.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PageContent.prototype, "seo", void 0);
exports.PageContent = PageContent = __decorate([
    (0, typeorm_1.Entity)('page_content'),
    (0, typeorm_1.Unique)(['pageSlug', 'sectionKey'])
], PageContent);
//# sourceMappingURL=content.entity.js.map