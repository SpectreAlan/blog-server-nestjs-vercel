import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { VisitorEntity } from './entities/visitor.entity';
import { statistics } from '../../core/utils/statistics';

@Injectable()
export class VisitorService {
  constructor(
    @InjectModel('Visitor')
    private readonly visitorEntity: Model<VisitorEntity>,
  ) {}

  async create(createVisitorDto: CreateVisitorDto) {
    const create = await this.visitorEntity.create(createVisitorDto);
    await create.save();
    return {
      message: 'success',
      data: null,
    };
  }

  async visitor() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today = await this.visitorEntity
      .countDocuments({
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      })
      .exec();
    const total = await this.visitorEntity.countDocuments().exec();
    return { today, total };
  }

  async findAll({ page, limit, ip, country, city, province, start, end }) {
    const query: any = {};
    if (ip) {
      query.ip = { $regex: new RegExp(ip, 'i') };
    }
    if (country) {
      query.country = { $regex: new RegExp(country, 'i') };
    }
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }
    if (province) {
      query.province = { $regex: new RegExp(province, 'i') };
    }
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end + ' 23:59:59.999');
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    const [list, total] = await Promise.all([
      this.visitorEntity
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.visitorEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.visitorEntity.deleteMany({
      _id: { $in: ids },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('访客不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }

  async statistics(start: string, end: string, type: string) {
    return await statistics(this.visitorEntity, start, end, type);
  }

  async analysis(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end + ' 23:59:59.999');
    const list = await this.visitorEntity
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
    const keys = ['country', 'province', 'city', 'device', 'os'];
    const data: any = {};
    list.map((item) => {
      keys.map((type) => {
        const key = item[type];
        if (!data[type]) {
          data[type] = {};
        }
        if (!data[type][key]) {
          data[type][key] = 0;
        }
        data[type][key] += 1;
      });
    });
    return { data };
  }
}
