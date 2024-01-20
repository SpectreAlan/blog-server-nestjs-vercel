import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UsePipes,
  UseInterceptors,
  Patch,
  Param,
} from '@nestjs/common';
import { PoemService } from './poem.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { DeleteItemsDto } from './dto/delete-common.dto';

@Controller('poem')
@UseInterceptors(ResponseInterceptor)
export class PoemController {
  constructor(private readonly poemService: PoemService) {}

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() createPoemDto: CreatePoemDto) {
    return this.poemService.create(createPoemDto);
  }

  @Patch(':id')
  @UsePipes(ClassValidatorPipe)
  update(@Param('id') id: string, @Body() updatePoemDto: UpdatePoemDto) {
    return this.poemService.update(id, updatePoemDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poemService.findOne(id);
  }
  @Get()
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('content') content: string,
    @Query('author') author: string,
    @Query('type') type: string,
  ) {
    return this.poemService.findAll({ page, limit, content, author, type });
  }
  @Delete()
  @UsePipes(ClassValidatorPipe)
  remove(@Body() deleteItemsDto: DeleteItemsDto) {
    return this.poemService.remove(deleteItemsDto.ids);
  }
}
