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
      await create.save();
      return {
        data: null,
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

  async incrementVisitorCount() {
    const key = 'visitor';
    const visitor = await this.settingEntity.findOne({ key });
    if (!visitor) {
      const create = await this.settingEntity.create({
        title: '网站访问量',
        key,
        value: 1,
      });
      await create.save();
      return {
        data: 1,
        message: 'success',
      };
    }
    visitor.value = (parseInt(visitor.value) + 1).toString();
    await visitor.save();
    return {
      data: parseInt(visitor.value),
      message: 'success',
    };
  }

  async getNotice() {
    const key = 'notice';
    const notice = await this.settingEntity.findOne({ key });
    if (!notice) {
      const msg = '欢迎访问小站~';
      const create = await this.settingEntity.create({
        title: '网站公告',
        key,
        value: msg,
      });
      await create.save();
      return {
        data: msg,
        message: 'success',
      };
    }
    return {
      data: notice.toObject().value,
      message: 'success',
    };
  }
}
