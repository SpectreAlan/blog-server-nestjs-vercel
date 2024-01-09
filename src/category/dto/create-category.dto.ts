import { IsNotEmpty } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名称必填' })
  readonly title: string;
}
