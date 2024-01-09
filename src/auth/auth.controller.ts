import { Req, Controller, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { sign } from 'jsonwebtoken';
import * as process from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req, @Res() res: ExpressResponse) {
    const user = await this.authService.validateGithubUser(req.user);
    const { status, nickName, role, avatar, account } = user;
    let encodedUser: string = 'null';
    if (status) {
      encodedUser = Buffer.from(
        JSON.stringify({ nickName, role, avatar, status }),
      ).toString('base64');
      const token = sign({ account, role }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      res.cookie('token', token, { httpOnly: true });
    }
    return res.redirect(
      'http://localhost:3000/home.html?token=' +
        encodeURIComponent(encodedUser),
    );
  }
}
