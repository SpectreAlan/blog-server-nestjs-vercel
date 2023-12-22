import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocumentType = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  tag: string;

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

  @Prop({ default: '' })
  date_create: string;

  @Prop({ default: '' })
  date_update: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
