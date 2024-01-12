import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PoemService } from './poem.service';
import { PoemController } from './poem.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PoemSchema } from './entities/poem.entity';
import { ValidateIdMiddleware } from '../../core/middleware/validate-id.middleware';
import { AuthMiddleware } from '../../core/middleware/auth.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Poem', schema: PoemSchema }])],
  exports: [PoemService],
  controllers: [PoemController],
  providers: [PoemService],
})
export class PoemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'poem/:id', method: RequestMethod.ALL });
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'poem', method: RequestMethod.GET },
        { path: 'poem', method: RequestMethod.DELETE },
      );
  }
}
