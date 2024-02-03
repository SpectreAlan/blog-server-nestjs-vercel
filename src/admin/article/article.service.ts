import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { ArticleEntity } from './entities/article.entity';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';
import { statistics } from '../../core/utils/statistics';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article')
    private readonly articleEntity: Model<ArticleEntity>,
    @Inject(TagService)
    private readonly tagService: TagService,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
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
      query.category = await this.categoryService.findIdsByTitle(category);
    }
    const [articles, total] = await Promise.all([
      this.articleEntity
        .find(query)
        .sort({ createdAt: -1 })
        .select(
          '_id title category cover tags scan status createdAt updatedAt description',
        )
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

  async statistics(start: string, end: string, type: string) {
    return await statistics(this.articleEntity, start, end, type);
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
    return { categoryList, totalArticle, totalCategory };
  }

  async detail(id: string, statistics?: boolean) {
    const article = await this.articleEntity
      .findById(id)
      .populate('category', 'title')
      .populate('tags', 'title');
    if (statistics) {
      article.scan = article.scan + 1;
      article.save();
    }
    return {
      data: article,
    };
  }

  async recentUpdate() {
    return await this.articleEntity
      .find()
      .select('_id title description cover updatedAt createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  async timeLine() {
    const list = await this.articleEntity
      .find()
      .select('_id title cover createdAt updatedAt')
      .sort({ createdAt: -1 });

    return { data: { list } };
  }
}
