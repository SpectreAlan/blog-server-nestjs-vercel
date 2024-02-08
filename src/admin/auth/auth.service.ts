import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async generateSms(req, phone: number) {
    const res = await this.userService.findByPhone(phone);
    if (!res) {
      throw new HttpException('验证码获取失败', HttpStatus.BAD_REQUEST);
    }
    const user = res.toObject();
    const sms = Math.floor(Math.random() * 899999 + 100000);
    const pushDeer = await fetch(
      `https://api2.pushdeer.com/message/push?pushkey=${user.pushDeer}&text=${sms}`,
    );
    const pushDeerResponse = await pushDeer.json();
    if (pushDeerResponse.code) {
      throw new HttpException('验证码发送失败', HttpStatus.BAD_REQUEST);
    }
    req.session.sms = {
      user,
      sms,
    };
    return {
      data: null,
      message: '验证码已发送',
    };
  }
}
