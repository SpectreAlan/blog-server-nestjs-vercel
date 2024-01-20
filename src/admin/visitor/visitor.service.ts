import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VisitorEntity } from './entities/visitor.entity';

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

  async findAll({ page, limit, title }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }
    const [list, total] = await Promise.all([
      this.visitorEntity
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.visitorEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }
  async remove(ids: string[]) {
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
}
