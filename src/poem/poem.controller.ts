import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { PoemService } from './poem.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { ClassValidatorPipe } from '../core/pipes/validationPipe';
import { ResponseInterceptor } from '../core/interceptors/response.interceptor';

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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title: string,
  ) {
    return this.poemService.findAll({ page, limit, title });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poemService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ClassValidatorPipe)
  update(@Param('id') id: string, @Body() updatePoemDto: UpdatePoemDto) {
    return this.poemService.update(id, updatePoemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poemService.remove(id);
  }
}
