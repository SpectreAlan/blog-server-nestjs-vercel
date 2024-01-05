import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './entities/tag.entity';
import { ValidateIdMiddleware } from '../core/middleware/validate-id.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }])],
  exports: [TagService],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'tag/:id', method: RequestMethod.ALL });
  }
}
