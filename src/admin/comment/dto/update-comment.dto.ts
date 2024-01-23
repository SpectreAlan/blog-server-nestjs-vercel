import { IsNotEmpty } from 'class-validator';
export class UpdateCommentDto {
  @IsNotEmpty({ message: '状态必填' })
  readonly status: string;
}
