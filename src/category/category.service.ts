import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryEntity } from './entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private readonly categoryEntity: Model<CategoryEntity>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const { title } = createCategoryDto;
    const doc = await this.categoryEntity.findOne({ title });
    if (doc) {
      throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
    }
    const create = await this.categoryEntity.create(createCategoryDto);
    return create.save();
  }

  findAll() {
    return this.categoryEntity.find();
  }

  findOne(id: number) {
    return this.categoryEntity.findById(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return this.categoryEntity.findByIdAndDelete(id);
  }
}
