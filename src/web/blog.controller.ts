import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  Query,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ArticleService } from '../admin/article/article.service';
import { CommentService } from '../admin/comment/comment.service';
import { TagService } from '../admin/tag/tag.service';
import { PoemService } from '../admin/poem/poem.service';
import { SettingService } from '../admin/setting/setting.service';
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
    private readonly poemService: PoemService,
    private readonly settingService: SettingService,
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
    return this.articleService.getArticleCountByCategory();
  }

  @Get('recentUpdate')
  async recentUpdate() {
    return this.articleService.recentUpdate();
  }

  @Get('tags')
  async tags() {
    return this.tagService.findAll({ page: 1, limit: 100, title: '' });
  }

  @Get('poem')
  async poem() {
    return this.poemService.getRandomPoems();
  }

  @Get('visitor')
  async visitor() {
    return this.settingService.incrementVisitorCount();
  }

  @Get('notice')
  async notice() {
    return this.settingService.getNotice();
  }

  @Get('timeLine')
  async timeLine() {
    return this.articleService.timeLine();
  }

  @Get('list')
  list(
    @Query('current') page: number = 1,
    @Query('keywords') keywords: string,
    @Query('category') category: string,
    @Query('tags') tags: string,
  ) {
    return this.articleService.findAll({
      page,
      limit: 10,
      keywords,
      category,
      tags,
      title: '',
      status: 1,
    });
  }

  @Get('detail')
  detail(@Query('id') id: string) {
    console.log(id);
    return this.articleService.findOne(id);
  }

  @Get('related')
  async related(@Query('tags') tags: string) {
    return this.articleService.findAll({
      tags,
      category: '',
      title: '',
      status: 1,
      limit: 10,
      page: 1,
      keywords: '',
    });
  }
}
