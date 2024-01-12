import { IsNotEmpty } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty({ message: '标签名称必填' })
  readonly title: string;
}
