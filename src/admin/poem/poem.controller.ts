import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { PoemService } from './poem.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

@Controller('poem')
@UseInterceptors(ResponseInterceptor)
export class PoemController {
  constructor(private readonly poemService: PoemService) {}

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() createPoemDto: CreatePoemDto) {
    return this.poemService.create(createPoemDto);
  }

  @Get()
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('title') title: string,
    @Query('author') author: string,
    @Query('type') type: string,
  ) {
    return this.poemService.findAll({ page, limit, title, author, type });
  }
  @Delete()
  remove(@Body() ids: string[]) {
    return this.poemService.remove(ids);
  }
}
