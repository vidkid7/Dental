import { CreateContentDto } from './create-content.dto';
declare const UpdateContentDto_base: import("@nestjs/common").Type<Partial<Omit<CreateContentDto, "pageSlug" | "sectionKey">>>;
export declare class UpdateContentDto extends UpdateContentDto_base {
}
export {};
