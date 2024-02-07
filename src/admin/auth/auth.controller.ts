import {
  Req,
  Controller,
  Get,
  Res,
  Post,
  UsePipes,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, Inject } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { UserService } from '../user/user.service';
import { SettingService } from '../setting/setting.service';
import { responseLoginResult } from '../../core/utils/common';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { LoginSmsDto } from './dto/login-sms.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(SettingService)
    private readonly settingService: SettingService,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req, @Res() res: ExpressResponse) {
    const user = await this.userService.validateGithubUser(req.user);
    responseLoginResult(res, user);
  }

  @Post('login')
  @UsePipes(ClassValidatorPipe)
  @UseInterceptors(ResponseInterceptor)
  async login(@Body() loginUserDto: LoginUserDto, @Req() req) {
    return this.userService.login(loginUserDto, req.session?.code);
  }

  @Get('captcha')
  captcha(@Req() req, @Res() res: ExpressResponse): void {
    const captcha = svgCaptcha.create({
      size: 5,
      fontSize: 50,
      width: 100,
      height: 30,
      ignoreChars: '0oO1iIlLaqp',
      color: true,
    });
    req.session.code = captcha.text;
    res.contentType('svg');
    res.status(200).send(captcha.data);
  }

  @UseInterceptors(ResponseInterceptor)
  @Get('sms')
  async sms(@Req() req: ParameterDecorator) {
    return this.authService.generateSms(req);
  }

  @Post('loginBySms')
  @UsePipes(ClassValidatorPipe)
  @UseInterceptors(ResponseInterceptor)
  async loginBySms(@Body() loginSmsDto: LoginSmsDto, @Req() req) {
    return this.authService.verifySms(loginSmsDto, req.session?.sms);
  }
}
