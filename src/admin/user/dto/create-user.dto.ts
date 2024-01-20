import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '内容必填' })
  readonly account: string;

  readonly password: string;
  readonly nickName: string;
  readonly avatar: string;
  readonly email: string;
  readonly role: string;
  readonly status: number;
}
