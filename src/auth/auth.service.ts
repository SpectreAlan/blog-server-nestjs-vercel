import { Injectable } from '@nestjs/common';
import { AuthEntity } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { SettingService } from '../setting/setting.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth')
    private readonly authEntity: Model<AuthEntity>,
    @Inject(SettingService)
    private readonly settingService: SettingService,
  ) {}

  async validateGithubUser(profile: any) {
    const { username: account, emails, photos, displayName } = profile;

    let user = await this.authEntity.findOne({ account });
    if (!user) {
      user = await this.authEntity.create({
        account,
        nickName: displayName || account,
        email: emails ? emails[0].value : null,
        avatar: photos ? photos[0].value : null,
        role: 'default',
      });
    }

    return user.toObject();
  }
}
