import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TagModule } from '../admin/tag/tag.module';
import { CategoryModule } from '../admin/category/category.module';
import { CommentModule } from '../admin/comment/comment.module';
import { ArticleModule } from '../admin/article/article.module';

@Module({
  imports: [TagModule, CategoryModule, CommentModule, ArticleModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
