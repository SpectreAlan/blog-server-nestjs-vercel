import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ArticleEntity {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }] })
  tags: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true })
  cover: string;

  @Prop({ required: true })
  keywords: string;

  @Prop({ default: 0 })
  scan: number;

  @Prop({ default: true })
  catalogue: boolean;

  @Prop({ default: 1 })
  status: number;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleEntity);
