import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagEntity } from './entities/tag.entity';
@Injectable()
export class TagService {
  constructor(
    @InjectModel('Tag')
    private readonly tagEntity: Model<TagEntity>,
  ) {}
  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const { title } = createTagDto;
    const doc = await this.tagEntity.findOne({ title });
    if (doc) {
      throw new HttpException('标签已存在', HttpStatus.BAD_REQUEST);
    }
    const create = await this.tagEntity.create(createTagDto);
    return create.save();
  }

  findAll() {
    return this.tagEntity.find();
  }

  findOne(id: number) {
    return this.tagEntity.findById(id);
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return this.tagEntity.findByIdAndDelete(id);
  }
}
