import { SettingsService } from './settings.service';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    findAll(category?: string): Promise<import("./entities/setting.entity").Setting[]>;
    getSettingsObject(category?: string): Promise<Record<string, string>>;
    findOne(key: string): Promise<import("./entities/setting.entity").Setting>;
    upsert(updateSettingDto: UpdateSettingDto): Promise<import("./entities/setting.entity").Setting>;
    bulkUpsert(bulkUpdateSettingsDto: BulkUpdateSettingsDto): Promise<import("./entities/setting.entity").Setting[]>;
    remove(key: string): Promise<void>;
}
