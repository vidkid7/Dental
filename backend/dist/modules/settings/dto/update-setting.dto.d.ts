export declare class UpdateSettingDto {
    key: string;
    value: string;
    category?: string;
    description?: string;
}
export declare class BulkUpdateSettingsDto {
    settings: UpdateSettingDto[];
}
