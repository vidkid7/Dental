import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async findAll(category?: string): Promise<Setting[]> {
    const query = this.settingRepository.createQueryBuilder('setting');
    
    if (category) {
      query.where('setting.category = :category', { category });
    }
    
    return query.getMany();
  }

  async findOne(key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async findByCategory(category: string): Promise<Setting[]> {
    return this.settingRepository.find({ where: { category } });
  }

  async upsert(updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const existing = await this.settingRepository.findOne({
      where: { key: updateSettingDto.key },
    });

    if (existing) {
      Object.assign(existing, updateSettingDto);
      return this.settingRepository.save(existing);
    }

    const newSetting = this.settingRepository.create(updateSettingDto);
    return this.settingRepository.save(newSetting);
  }

  async bulkUpsert(settings: UpdateSettingDto[]): Promise<Setting[]> {
    const results: Setting[] = [];
    
    for (const settingDto of settings) {
      const result = await this.upsert(settingDto);
      results.push(result);
    }
    
    return results;
  }

  async remove(key: string): Promise<void> {
    const setting = await this.findOne(key);
    await this.settingRepository.remove(setting);
  }

  // Helper method to get settings as key-value object
  async getSettingsObject(category?: string): Promise<Record<string, string>> {
    const settings = await this.findAll(category);
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }
}
