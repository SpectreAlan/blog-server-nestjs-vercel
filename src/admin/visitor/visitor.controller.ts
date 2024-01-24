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
    @Query('ip') ip: string,
    @Query('country') country: string,
    @Query('province') province: string,
    @Query('city') city: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.visitorService.findAll({
      page,
      limit,
      ip,
      city,
      province,
      country,
      end,
      start,
    });
  }

  @Delete()
  @UsePipes(ClassValidatorPipe)
  remove(@Body() deleteItemsDto: DeleteItemsDto) {
    return this.visitorService.remove(deleteItemsDto.ids);
  }

  @Get('statistics')
  statistics(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('type') type: string,
  ) {
    return this.visitorService.statistics(start, end, type);
  }

  @Get('records')
  records(@Query('start') start: string, @Query('end') end: string) {
    return this.visitorService.types(start, end);
  }
}
