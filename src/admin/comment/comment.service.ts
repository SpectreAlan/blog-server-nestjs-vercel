import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CommentEntity } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { statisticsByDay, statisticsByMonth } from '../../core/utils';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment')
    private readonly commentEntity: Model<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const create = await this.commentEntity.create(createCommentDto);
    await create.save();
    return {
      message: '操作成功',
      data: null,
    };
  }

  async findAll({ page, limit, content, article, email }) {
    const query: any = {};
    if (content) {
      query.content = { $regex: new RegExp(content, 'i') };
    }
    if (article) {
      query.article = { $regex: new RegExp(article, 'i') };
    }
    if (email) {
      query.email = { $regex: new RegExp(email, 'i') };
    }
    const [list, total] = await Promise.all([
      this.commentEntity
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('article', 'title')
        .exec(),
      this.commentEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentEntity.findById(id);
    if (!comment) {
      throw new HttpException('评论不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(comment, updateCommentDto);
    const data = await comment.save();
    return {
      data,
      message: '更新成功',
    };
  }

  async findOne(id: string) {
    const data = await this.commentEntity.findById(id);
    return {
      data,
    };
  }

  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.commentEntity.deleteMany({
      _id: { $in: ids },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('评论不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }

  async statistics(start: string, end: string, type: string) {
    const startDate = new Date(start);
    const endDate = new Date(end + ' 23:59:59.999');
    const data =
      type === 'day'
        ? await statisticsByDay(this.commentEntity, startDate, endDate)
        : await statisticsByMonth(this.commentEntity, startDate, endDate);
    return { data };
  }

  async comments(article: string) {
    const data = await this.commentEntity.find({ article });
    return {
      data,
    };
  }
}
