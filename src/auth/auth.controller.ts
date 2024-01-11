import {
  Req,
  Controller,
  Get,
  Res,
  Post,
  UsePipes,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, Inject } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { UserService } from '../user/user.service';
import { responseLoginResult } from '../core/utils';
import { ClassValidatorPipe } from '../core/pipes/validationPipe';
import { LoginUserDto } from '../user/dto/login-user.dto';

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
    responseLoginResult(res, user);
  }

  @Post('login')
  @UsePipes(ClassValidatorPipe)
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: ExpressResponse) {
    const user = await this.userService.login(loginUserDto);
    responseLoginResult(res, user);
  }
}
