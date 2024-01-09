import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingEntity } from './entities/setting.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class SettingService {
  constructor(
    @InjectModel('Setting')
    private readonly settingEntity: Model<SettingEntity>,
  ) {}
  async create(createSettingDto: CreateSettingDto) {
    try {
      const create = await this.settingEntity.create(createSettingDto);
      const data = await create.save();
      return {
        data,
        message: '创建成功',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('配置已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll() {
    const list = await this.settingEntity
      .find()
      .select('title key type _id')
      .exec();
    return { list };
  }

  async findOne(id: string) {
    const data = await this.settingEntity.findById(id);
    return { data };
  }

  getSetting(key: string) {
    return this.settingEntity.findOne({ key });
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    const setting = await this.settingEntity.findById(id);
    if (!setting) {
      throw new HttpException('配置不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(setting, updateSettingDto);
    const data = await setting.save();
    return {
      data,
      message: '更新成功',
    };
  }

  async remove(id: string) {
    const setting = await this.settingEntity.findById(id);
    if (!setting) {
      throw new HttpException('配置不存在', HttpStatus.BAD_REQUEST);
    }
    if (setting.type === 'system') {
      throw new HttpException('系统配置不允许删除', HttpStatus.BAD_REQUEST);
    }
    await this.settingEntity.findByIdAndDelete(id);
    return {
      data: null,
      message: '删除成功',
    };
  }
}
