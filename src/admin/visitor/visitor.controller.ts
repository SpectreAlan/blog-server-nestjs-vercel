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
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

@Controller('visitor')
@UseInterceptors(ResponseInterceptor)
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title: string,
  ) {
    return this.visitorService.findAll({ page, limit, title });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorService.remove(id);
  }
}
