import { IsNotEmpty } from 'class-validator';
export class LoginSmsDto {
  @IsNotEmpty({ message: '手机号必填' })
  readonly phone: string;

  @IsNotEmpty({ message: '密码必填' })
  readonly sms: string;
}
