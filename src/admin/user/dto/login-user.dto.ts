import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty({ message: '账号必填' })
  readonly account: string;

  @IsNotEmpty({ message: '密码必填' })
  readonly password: string;

  @IsNotEmpty({ message: '验证码必填' })
  readonly captcha: string;
}
