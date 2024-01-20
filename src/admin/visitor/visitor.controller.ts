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
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { DeleteItemsDto } from '../poem/dto/delete-common.dto';

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
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('title') title: string,
  ) {
    return this.visitorService.findAll({ page, limit, title });
  }

  @Delete()
  @UsePipes(ClassValidatorPipe)
  remove(@Body() deleteItemsDto: DeleteItemsDto) {
    return this.visitorService.remove(deleteItemsDto.ids);
  }
}
