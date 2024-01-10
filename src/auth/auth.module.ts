import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GithubStrategy } from '../core/strategy/github.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [GithubStrategy],
})
export class AuthModule {}
