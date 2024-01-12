import { IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
export class CreateArticleDto {
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @IsNotEmpty({ message: '文章简介必填' })
  readonly description: string;

  @IsNotEmpty({ message: '文章内容必填' })
  readonly content: string;

  @IsNotEmpty({ message: '文章分类必填' })
  readonly category: string;

  @IsArray()
  @ArrayMinSize(1, { message: '文章标签必填' })
  tags: MongooseSchema.Types.ObjectId[];

  @IsNotEmpty({ message: '关键字必填' })
  readonly keywords: string;

  @IsNotEmpty({ message: '封面必填' })
  readonly cover: string;
}
