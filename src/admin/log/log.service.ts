import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectModel('Log')
    private readonly logEntity: Model<LogEntity>,
  ) {}

  async create(createLogDto: CreateLogDto) {
    const create = await this.logEntity.create(createLogDto);
    await create.save();
    return {
      message: '记录成功',
      data: null,
    };
  }

  async findAll({ page, limit, ip, url, method }) {
    const query: any = {};
    if (ip) {
      query.ip = { $regex: new RegExp(ip, 'i') };
    }

    if (url) {
      query.url = { $regex: new RegExp(url, 'i') };
    }

    if (method) {
      query.method = { $regex: new RegExp(method, 'i') };
    }

    const [list, total] = await Promise.all([
      this.logEntity
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.logEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.logEntity.deleteMany({
      _id: { $in: ids },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('日志不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }
}
