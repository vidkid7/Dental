import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsService {
    private readonly settingRepository;
    constructor(settingRepository: Repository<Setting>);
    findAll(category?: string): Promise<Setting[]>;
    findOne(key: string): Promise<Setting>;
    findByCategory(category: string): Promise<Setting[]>;
    upsert(updateSettingDto: UpdateSettingDto): Promise<Setting>;
    bulkUpsert(settings: UpdateSettingDto[]): Promise<Setting[]>;
    remove(key: string): Promise<void>;
    getSettingsObject(category?: string): Promise<Record<string, string>>;
}
