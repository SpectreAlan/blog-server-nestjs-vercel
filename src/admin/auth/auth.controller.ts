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
import { responseLoginResult } from '../../core/utils/common';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

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
  @UseInterceptors(ResponseInterceptor)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
}
