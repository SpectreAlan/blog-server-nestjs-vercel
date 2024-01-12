import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './admin/article/article.module';
import { TagModule } from './admin/tag/tag.module';
import { PoemModule } from './admin/poem/poem.module';
import { CategoryModule } from './admin/category/category.module';
import { CommentModule } from './admin/comment/comment.module';
import { VisitorModule } from './admin/visitor/visitor.module';
import { APP_FILTER } from '@nestjs/core';

import { ResponseFilter } from './core/filters/response.filter';
import { FileModule } from './admin/file/file.module';
import { AuthModule } from './admin/auth/auth.module';
import { SettingModule } from './admin/setting/setting.module';
import { UserModule } from './admin/user/user.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL, {}),
    ArticleModule,
    TagModule,
    CategoryModule,
    FileModule,
    AuthModule,
    SettingModule,
    UserModule,
    PoemModule,
    CommentModule,
    VisitorModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ResponseFilter,
    },
    AppService,
  ],
})
export class AppModule {}
