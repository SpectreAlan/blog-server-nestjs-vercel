import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GithubStrategy } from '../../core/strategy/github.strategy';
import { UserModule } from '../user/user.module';
import { SettingModule } from '../setting/setting.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, SettingModule],
  controllers: [AuthController],
  providers: [GithubStrategy, AuthService],
})
export class AuthModule {}
