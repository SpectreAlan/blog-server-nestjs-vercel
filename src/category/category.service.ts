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
  async create(category: CreateCategoryDto) {
    try {
      const create = await this.categoryEntity.create(category);
      return {
        data: create.save(),
        message: '添加成功',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
  async findIdsByTitles(titles: string[]) {
    const categories = await this.categoryEntity
      .find({ title: { $in: titles } })
      .exec();
    return categories.map((category) => category._id);
  }
  async findAll({ page, limit, title }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }
    const [categories, total] = await Promise.all([
      this.categoryEntity
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.categoryEntity.countDocuments(query).exec(),
    ]);

    return { data: { total, list: categories } };
  }

  async findOne(id: string) {
    const data = await this.categoryEntity.findById(id);
    return {
      data,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryEntity.findById(id);
    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(category, updateCategoryDto);
    const data = await category.save();
    return {
      data,
      message: '更新成功',
    };
  }

  async remove(id: string) {
    const data = await this.categoryEntity.findByIdAndDelete(id);
    if (!data) {
      throw new HttpException('分类不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }
}
