import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty({ message: '类型必填' })
  readonly url: string;

  readonly description: string;
}
