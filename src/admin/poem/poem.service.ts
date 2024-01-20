import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
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

  async findOne(id: string) {
    const data = await this.poemEntity.findById(id);
    return {
      data,
    };
  }

  async update(id: string, updatePoemDto: UpdatePoemDto) {
    const poem = await this.poemEntity.findById(id);
    if (!poem) {
      throw new HttpException('一言不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(poem, updatePoemDto);
    await poem.save();
    return {
      data: null,
      message: '更新成功',
    };
  }
  async findAll({ page, limit, content, author, type }) {
    const query: any = {};
    if (content) {
      query.content = { $regex: new RegExp(content, 'i') };
    }

    if (author) {
      query.author = { $regex: new RegExp(author, 'i') };
    }

    if (type) {
      query.type = { $regex: new RegExp(type, 'i') };
    }

    const [list, total] = await Promise.all([
      this.poemEntity
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.poemEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.poemEntity.deleteMany({
      _id: { $in: ids },
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
