import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectModel('Tag')
    private readonly tagEntity: Model<TagEntity>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const create = await this.tagEntity.create(createTagDto);
      await create.save();
      return {
        message: '创建成功',
        data: null,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('标签已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll({ page, limit, title }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }
    const [list, total] = await Promise.all([
      this.tagEntity
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.tagEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async findOne(id: string) {
    const data = await this.tagEntity.findById(id);
    return {
      data,
    };
  }

  async findIdsByTitles(titles: string[]) {
    const tags = await this.tagEntity.find({ title: { $in: titles } }).exec();
    return tags.map((tag) => tag._id);
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagEntity.findById(id);
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(tag, updateTagDto);
    const data = await tag.save();
    return {
      data,
      message: '更新成功',
    };
  }

  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.tagEntity.deleteMany({
      _id: { $in: ids },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }
}
