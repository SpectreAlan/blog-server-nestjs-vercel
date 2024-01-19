import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { TagModule } from '../admin/tag/tag.module';
import { CategoryModule } from '../admin/category/category.module';
import { CommentModule } from '../admin/comment/comment.module';
import { PoemModule } from '../admin/poem/poem.module';
import { SettingModule } from '../admin/setting/setting.module';
import { ArticleModule } from '../admin/article/article.module';

@Module({
  imports: [
    TagModule,
    CategoryModule,
    CommentModule,
    ArticleModule,
    PoemModule,
    SettingModule,
  ],
  controllers: [BlogController],
  providers: [],
})
export class BlogModule {}
