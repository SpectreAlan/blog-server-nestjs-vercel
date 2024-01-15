import { IsNotEmpty } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty({ message: '内容必填' })
  readonly content: string;

  @IsNotEmpty({ message: '文章ID必填' })
  readonly article: string;

  @IsNotEmpty({ message: '昵称必填' })
  readonly nickName: string;

  readonly email: string;
  readonly parentId: string;
}
