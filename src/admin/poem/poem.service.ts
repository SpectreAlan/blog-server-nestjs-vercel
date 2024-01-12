import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
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

  async findAll({ page, limit, title }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
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

  async findOne(id: string) {
    const data = await this.poemEntity.findById(id);
    return {
      data,
    };
  }

  async findIdsByTitles(titles: string[]) {
    const poems = await this.poemEntity.find({ title: { $in: titles } }).exec();
    return poems.map((poem) => poem._id);
  }

  async update(id: string, updatePoemDto: UpdatePoemDto) {
    const poem = await this.poemEntity.findById(id);
    if (!poem) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(poem, updatePoemDto);
    const data = await poem.save();
    return {
      data,
      message: '更新成功',
    };
  }

  async remove(id: string) {
    const data = await this.poemEntity.findByIdAndDelete(id);
    if (!data) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }
}
