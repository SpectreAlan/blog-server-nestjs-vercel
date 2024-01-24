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
      message: '创建成功',
      data: null,
    };
  }

  async findAll({ page, limit, ip, country, city, province }) {
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
}
