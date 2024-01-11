import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { APP_FILTER } from '@nestjs/core';

import { ResponseFilter } from './core/filters/response.filter';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';
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
