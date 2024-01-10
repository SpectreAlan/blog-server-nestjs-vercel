import { Req, Controller, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, Inject } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req, @Res() res: ExpressResponse) {
    const user = await this.userService.validateGithubUser(req.user);
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
