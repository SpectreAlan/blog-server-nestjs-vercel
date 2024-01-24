import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UsePipes,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { DeleteItemsDto } from '../poem/dto/delete-common.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@UseInterceptors(ResponseInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('content') content: string,
    @Query('article') article: string,
    @Query('email') email: string,
  ) {
    return this.commentService.findAll({
      page,
      limit,
      content,
      article,
      email,
    });
  }

  @Get('detail')
  findOne(@Query('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ClassValidatorPipe)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }
  @Delete()
  @UsePipes(ClassValidatorPipe)
  remove(@Body() deleteItemsDto: DeleteItemsDto) {
    return this.commentService.remove(deleteItemsDto.ids);
  }

  @Get('statistics')
  statistics(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('type') type: string,
  ) {
    return this.commentService.statistics(start, end, type);
  }
}
