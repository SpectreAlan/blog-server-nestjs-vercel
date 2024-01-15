import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

@Controller('article')
@UseInterceptors(ResponseInterceptor)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title: string,
    @Query('status') status: number,
    @Query('category') category: string,
    @Query('tags') tags: string,
    @Query('keywords') keywords: string,
  ) {
    return this.articleService.findAll({
      page,
      limit,
      title,
      status,
      category,
      tags,
      keywords,
    });
  }

  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ClassValidatorPipe)
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.articleService.remove(id);
  }
}
