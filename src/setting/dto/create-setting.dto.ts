import { IsNotEmpty } from 'class-validator';

export class CreateSettingDto {
  @IsNotEmpty({ message: '名称必填' })
  readonly title: string;

  @IsNotEmpty({ message: 'key必填' })
  readonly key: string;

  @IsNotEmpty({ message: 'value必填' })
  readonly value: string;

  readonly type: string;
}
