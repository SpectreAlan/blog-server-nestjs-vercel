import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentEntity } from './entities/comment.entity';

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

  async findAll({ page, limit, title }) {
    const query: any = {};
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }
    const [list, total] = await Promise.all([
      this.commentEntity
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('article', 'title')
        .exec(),
      this.commentEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async remove(ids: string[]) {
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

  async comments(article: string) {
    const data = await this.commentEntity.find({ article });
    return {
      data,
    };
  }
}
