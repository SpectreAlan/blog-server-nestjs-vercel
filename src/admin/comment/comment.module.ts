import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SettingModule } from '../setting/setting.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comment.entity';
import { ValidateIdMiddleware } from '../../core/middleware/validate-id.middleware';
import { AuthMiddleware } from '../../core/middleware/auth.middleware';

@Module({
  imports: [
    SettingModule,
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  exports: [CommentService],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'comment/:id', method: RequestMethod.PATCH });
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'comment', method: RequestMethod.ALL });
  }
}
