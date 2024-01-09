import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SettingModule } from '../setting/setting.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './entities/auth.entity';
import { GithubStrategy } from '../core/strategy/github.strategy';

@Module({
  imports: [
    SettingModule,
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy],
})
export class AuthModule {}
