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

  async create(user, article: CreateArticleDto): Promise<ArticleEntity> {
    console.log(article);
    const { title } = article;
    const doc = await this.articleEntity.findOne({ title });
    if (doc) {
      throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
    }
    const create = await this.articleEntity.create(article);
    return create.save();
  }

  findAll() {
    return this.articleEntity
      .find()
      .populate('category')
      .populate('tags')
      .exec();
  }

  async findOne(id: number) {
    return this.articleEntity.findById(id);
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: string) {
    return this.articleEntity.findByIdAndDelete(id);
  }
}
