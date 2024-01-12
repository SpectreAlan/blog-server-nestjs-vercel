import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingSchema } from './entities/setting.entity';
import { ValidateIdMiddleware } from '../../core/middleware/validate-id.middleware';
import { AuthMiddleware } from '../../core/middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Setting', schema: SettingSchema }]),
  ],
  exports: [SettingService],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'setting/:id', method: RequestMethod.ALL });
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'setting', method: RequestMethod.ALL });
  }
}
