import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from '../admin/article/article.service';
import { CommentService } from '../admin/comment/comment.service';
import { TagService } from '../admin/tag/tag.service';
import { CreateCommentDto } from '../admin/comment/dto/create-comment.dto';
import { ClassValidatorPipe } from '../core/pipes/validationPipe';
import { ResponseInterceptor } from '../core/interceptors/response.interceptor';

@Controller('blog')
@UseInterceptors(ResponseInterceptor)
export class BlogController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly tagService: TagService,
  ) {}

  @Post('comment')
  @UsePipes(ClassValidatorPipe)
  comment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get('comment:id')
  @UsePipes(ClassValidatorPipe)
  comments(@Param('id') id: string) {
    return this.commentService.comments(id);
  }

  @Get('category')
  async category() {
    const data = await this.articleService.getArticleCountByCategory();
    return {
      data,
    };
  }

  @Get('recentUpdate')
  async recentUpdate() {
    return this.articleService.recentUpdate();
  }

  @Get('tags')
  async tags() {
    const tags = await this.tagService.findAll({
      page: 1,
      limit: 100,
      title: '',
    });
    const tagsList = tags.data.list.map((item) => item.title);
    return {
      data: { tagsList, totalTags: tagsList.length },
    };
  }

  @Get('list')
  list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keywords') keywords: string,
    @Query('category') category: string,
    @Query('tags') tags: string,
  ) {
    return this.articleService.findAll({
      page,
      limit,
      keywords,
      category,
      tags,
      title: '',
      status: 1,
    });
  }
}