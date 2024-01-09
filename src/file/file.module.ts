import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileSchema } from './entities/file.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateIdMiddleware } from '../core/middleware/validate-id.middleware';
import { AuthMiddleware } from '../core/middleware/auth.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  exports: [FileService],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'file/:id', method: RequestMethod.ALL });
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'file', method: RequestMethod.ALL });
  }
}
