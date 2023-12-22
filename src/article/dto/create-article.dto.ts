import { IsNotEmpty } from 'class-validator';
export class CreateArticleDto {
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @IsNotEmpty({ message: '文章简介必填' })
  readonly description: string;

  @IsNotEmpty({ message: '文章内容必填' })
  readonly content: string;

  @IsNotEmpty({ message: '文章分类必填' })
  readonly category: string;

  @IsNotEmpty({ message: '文章标签必填' })
  readonly tag: string;

  @IsNotEmpty({ message: '文章标签必填' })
  readonly keywords: string;

  @IsNotEmpty({ message: '文章标签必填' })
  readonly cover: string;
}
