import { IsNotEmpty } from 'class-validator';
export class CreatePoemDto {
  @IsNotEmpty({ message: '内容必填' })
  readonly content: string;
}
