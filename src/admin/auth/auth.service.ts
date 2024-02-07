import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SettingService } from '../setting/setting.service';
import { LoginSmsDto } from './dto/login-sms.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SettingService)
    private readonly settingService: SettingService,
  ) {}

  async generateSms(req) {
    const setting = await this.settingService.getSetting('pushDeer');
    if (!setting) {
      throw new HttpException('验证码配置不存在', HttpStatus.BAD_REQUEST);
    }
    const sms = Math.floor(Math.random() * 899999 + 100000);
    const pushDeer = await fetch(
      `https://api2.pushdeer.com/message/push?pushkey=${setting.toObject().value}&text=${sms}`,
    );
    const pushDeerResponse = await pushDeer.json();
    if (pushDeerResponse.code) {
      throw new HttpException('验证码发送失败', HttpStatus.BAD_REQUEST);
    }
    req.session.sms = sms;
    return {
      data: null,
      message: '验证码已发送',
    };
  }
  async verifySms(loginSmsDto: LoginSmsDto, code: string) {
    const { phone, sms } = loginSmsDto;
    if (!code || !sms || sms !== code) {
      throw new HttpException('验证码/手机号不正确', HttpStatus.BAD_REQUEST);
    }
    const setting = await this.settingService.getSetting('sms');
    if (!setting) {
      throw new HttpException('验证码配置不存在', HttpStatus.BAD_REQUEST);
    }
    if (phone !== setting.toObject().value) {
      throw new HttpException('验证码/手机号不正确', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '验证码已发送',
    };
  }
}
