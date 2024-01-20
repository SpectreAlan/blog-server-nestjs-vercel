import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePoemDto } from './dto/create-poem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PoemEntity } from './entities/poem.entity';

@Injectable()
export class PoemService {
  constructor(
    @InjectModel('Poem')
    private readonly poemEntity: Model<PoemEntity>,
  ) {}

  async create(createPoemDto: CreatePoemDto) {
    try {
      const create = await this.poemEntity.create(createPoemDto);
      await create.save();
      return {
        message: '创建成功',
        data: null,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('一言已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll({ page, limit, title, author }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    if (author) {
      query.title = { $regex: new RegExp(author, 'i') };
    }
    const [list, total] = await Promise.all([
      this.poemEntity
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.poemEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }
  async remove(id: string) {
    const data = await this.poemEntity.deleteMany({
      _id: { $in: id.split(',') },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('一言不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }

  async getRandomPoems() {
    const list = await this.poemEntity.aggregate([{ $sample: { size: 10 } }]);
    return { data: { list } };
  }
}
