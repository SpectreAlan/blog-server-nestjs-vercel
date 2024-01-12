import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorSchema } from './entities/visitor.entity';
import { ValidateIdMiddleware } from '../../core/middleware/validate-id.middleware';
import { AuthMiddleware } from '../../core/middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Visitor', schema: VisitorSchema }]),
  ],
  exports: [VisitorService],
  controllers: [VisitorController],
  providers: [VisitorService],
})
export class VisitorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'visitor/:id', method: RequestMethod.ALL });
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'visitor', method: RequestMethod.GET },
        { path: 'visitor', method: RequestMethod.DELETE },
      );
  }
}
