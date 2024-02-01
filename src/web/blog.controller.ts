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
import { PoemService } from '../admin/poem/poem.service';
import { VisitorService } from '../admin/visitor/visitor.service';
import { SettingService } from '../admin/setting/setting.service';
import { CreateCommentDto } from '../admin/comment/dto/create-comment.dto';
import { ClassValidatorPipe } from '../core/pipes/validationPipe';
import { ResponseInterceptor } from '../core/interceptors/response.interceptor';
import { CreateVisitorDto } from '../admin/visitor/dto/create-visitor.dto';

@Controller('blog')
@UseInterceptors(ResponseInterceptor)
export class BlogController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly tagService: TagService,
    private readonly poemService: PoemService,
    private readonly settingService: SettingService,
    private readonly visitorService: VisitorService,
  ) {}

  @Post('comment')
  @UsePipes(ClassValidatorPipe)
  comment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create({
      ...createCommentDto,
      author: 0,
      pinned: 0,
      status: 0,
    });
  }

  @Get('comment:id')
  @UsePipes(ClassValidatorPipe)
  comments(@Param('id') id: string) {
    return this.commentService.comments(id);
  }

  @Get('aside')
  async aside() {
    const category = await this.articleService.getArticleCountByCategory();
    const list = await this.articleService.recentUpdate();
    const notice = await this.settingService.getNotice();
    const tags = await this.tagService.findAll({
      page: 1,
      limit: 100,
      title: '',
    });
    return {
      data: {
        ...category,
        list,
        tags: tags.data.list.map((item) => item.title),
        notice,
      },
    };
  }

  @Get('poem')
  async poem() {
    return this.poemService.getRandomPoems();
  }

  @Get('visitor')
  async visitor() {
    const visitor = await this.settingService.incrementVisitorCount();
    const statistics = await this.visitorService.visitor();
    return { data: { visitor, ...statistics } };
  }

  @Post('statistics')
  @UsePipes(ClassValidatorPipe)
  async statistics(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
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
    return this.articleService.detail(id);
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
