import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './entities/article.entity';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';
import { ValidateIdMiddleware } from '../../core/middleware/validate-id.middleware';
import { AuthMiddleware } from '../../core/middleware/auth.middleware';

@Module({
  imports: [
    TagModule,
    CategoryModule,
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  exports: [ArticleService],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes({ path: 'article/:id', method: RequestMethod.PATCH });
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'article', method: RequestMethod.ALL },
        { path: 'article/*', method: RequestMethod.ALL },
      );
  }
}
