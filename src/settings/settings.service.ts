import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { Setting, SettingDocument } from './schemas/setting.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async findByKeyPublic(key: string) {
    const doc = await this.settingModel.findOne({ key: key.trim() }).lean();
    if (!doc) {
      throw new NotFoundException('Configuración no encontrada');
    }
    return { key: doc.key, value: doc.value };
  }

  async findAll() {
    return this.settingModel.find().sort({ key: 1 }).lean();
  }

  async upsert(dto: UpsertSettingDto) {
    return this.settingModel
      .findOneAndUpdate(
        { key: dto.key.trim() },
        { value: dto.value },
        { upsert: true, new: true },
      )
      .lean();
  }

  async remove(key: string) {
    const res = await this.settingModel.findOneAndDelete({ key: key.trim() });
    if (!res) {
      throw new NotFoundException('Configuración no encontrada');
    }
    return { ok: true };
  }
}
