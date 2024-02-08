import { IsNotEmpty } from 'class-validator';
export class LoginSmsDto {
  @IsNotEmpty({ message: '手机号必填' })
  readonly phone: string;

  @IsNotEmpty({ message: '验证码必填' })
  readonly sms: string;
}

export class LoginGetSmsDto {
  @IsNotEmpty({ message: '手机号必填' })
  readonly phone: number;
}
