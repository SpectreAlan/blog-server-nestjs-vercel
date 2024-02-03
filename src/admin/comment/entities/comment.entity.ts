import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CommentEntity {
  @Prop({ required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Article',
    required: true,
  })
  article: MongooseSchema.Types.ObjectId;

  @Prop()
  nickName: string;

  @Prop()
  email: string;

  @Prop()
  platform: string;

  @Prop({ default: '未知' })
  region: string;

  @Prop({ default: -1 })
  parentId: string;

  @Prop({ default: 0 })
  status: number;

  @Prop({ default: 0 })
  author: number;

  @Prop({ default: 0 })
  pinned: number;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);
