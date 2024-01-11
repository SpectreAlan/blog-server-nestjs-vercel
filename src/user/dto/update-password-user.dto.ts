import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsNotEmpty({ message: '密码必填' })
  password: string;

  @IsNotEmpty({ message: 'ID必填' })
  id: string;

  oldPassword: string;
}
