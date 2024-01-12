import { IsNotEmpty } from 'class-validator';

export class CreateVisitorDto {
  @IsNotEmpty({ message: 'IP必填' })
  readonly ip: string;
  readonly device: string;
  readonly os: string;
  readonly country: string;
  readonly province: string;
  readonly city: string;
}
