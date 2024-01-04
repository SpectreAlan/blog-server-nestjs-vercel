import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleEntity } from './entities/article.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article')
    private readonly articleEntity: Model<ArticleEntity>,
    @Inject(TagService)
    private readonly tagService: TagService,
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

  async findAll({ page, limit, title, status, category, tags }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    if (status !== undefined) {
      query.status = status;
    }

    if (tags !== undefined) {
      const tagIds = await this.tagService.findIdsByTitles(tags.split(','));
      query.tags = { $in: tagIds };
    }

    if (category !== undefined) {
      query.category = category;
    }
    const [articles, total] = await Promise.all([
      this.articleEntity
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category')
        .populate('tags')
        .exec(),
      this.articleEntity.countDocuments(query).exec(),
    ]);

    const formattedArticles = articles.map((article) => ({
      ...article.toObject(),
      tags: article.tags.map((tag: any) => tag.title),
      category: (article.category as any).title,
    }));

    return { data: { total, list: formattedArticles } };
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
