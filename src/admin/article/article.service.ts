import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { ArticleEntity } from './entities/article.entity';
import { TagService } from '../tag/tag.service';
import { statisticsByMonth } from '../../core/utils';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article')
    private readonly articleEntity: Model<ArticleEntity>,
    @Inject(TagService)
    private readonly tagService: TagService,
  ) {}

  async create(article: CreateArticleDto) {
    try {
      const create = await this.articleEntity.create(article);
      const data = await create.save();
      return {
        data,
        message: '创建成功',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll({ page, limit, title, status, category, tags, keywords }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    if (status) {
      query.status = status;
    }

    if (tags) {
      const tagIds = await this.tagService.findIdsByTitles(tags.split(','));
      query.tags = { $in: tagIds };
    }

    if (keywords) {
      query.$or = [
        { title: { $regex: new RegExp(keywords, 'i') } },
        { content: { $regex: new RegExp(keywords, 'i') } },
      ];
    }

    if (category) {
      query.category = category;
    }
    const [articles, total] = await Promise.all([
      this.articleEntity
        .find(query)
        .sort({ createdAt: -1 })
        .select('_id title category cover tags scan status createdAt updatedAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category', 'title')
        .populate('tags', 'title')
        .exec(),
      this.articleEntity.countDocuments(query).exec(),
    ]);

    return { data: { total, list: articles } };
  }

  async findOne(id: string) {
    const data = await this.articleEntity.findById(id);
    return {
      data,
    };
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleEntity.findById(id);
    if (!article) {
      throw new HttpException('文章不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(article, updateArticleDto);
    await article.save();
    return {
      data: null,
      message: '更新成功',
    };
  }
  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.articleEntity.deleteMany({
      _id: { $in: ids },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('文章不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }

  async statistics() {
    const result = await statisticsByMonth(
      this.articleEntity,
      '2023-01-01',
      '2024-02-01',
    );
    console.log(result);
    return { data: { result } };
  }

  async getArticleCountByCategory() {
    const res = await this.articleEntity.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: '$categoryInfo',
      },
      {
        $project: {
          category: '$categoryInfo.title',
          count: 1,
        },
      },
    ]);
    let totalArticle = 0;
    let totalCategory = 0;
    const categoryList = res.map((item) => {
      totalArticle += item.count;
      totalCategory += 1;
      return {
        category: item.category,
        count: item.count,
      };
    });
    return { data: { categoryList, totalArticle, totalCategory } };
  }

  async detail(id: string) {
    const data = await this.articleEntity
      .findById(id)
      .populate('category', 'title')
      .populate('tags', 'title');
    return {
      data,
    };
  }

  async recentUpdate() {
    const list = await this.articleEntity
      .find()
      .select('_id title description cover updatedAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    return { data: { list } };
  }

  async timeLine() {
    const list = await this.articleEntity
      .find()
      .select('_id title cover createdAt updatedAt')
      .sort({ createdAt: -1 });

    return { data: { list } };
  }
}
