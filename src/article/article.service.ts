import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article')
    private readonly articleEntity: Model<ArticleEntity>,
  ) {}

  async create(user, article: CreateArticleDto) {
    try {
      const create = await this.articleEntity.create(article);
      return {
        data: create.save(),
        message: '添加成功',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  findAll() {
    return this.articleEntity
      .find()
      .populate('category')
      .populate('tags')
      .exec()
      .then((articles) => {
        return {
          data: articles.map((article) => ({
            ...article.toObject(),
            tags: article.tags.map((tag: any) => tag.title),
            category: (article.category as any).title,
          })),
        };
      });
  }

  async findOne(id: number) {
    return {
      data: this.articleEntity.findById(id),
    };
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: string) {
    return {
      data: this.articleEntity.findByIdAndDelete(id),
      message: '删除成功',
    };
  }
}
