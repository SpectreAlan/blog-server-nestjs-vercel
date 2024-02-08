import {
  Controller,
  Get,
  Body,
  Delete,
  Query,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { LogService } from './log.service';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { DeleteItemsDto } from '../poem/dto/delete-common.dto';

@Controller('log')
@UseInterceptors(ResponseInterceptor)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('ip') ip: string,
    @Query('url') url: string,
    @Query('method') method: string,
  ) {
    return this.logService.findAll({ page, limit, method, url, ip });
  }
  @Delete()
  @UsePipes(ClassValidatorPipe)
  remove(@Body() deleteItemsDto: DeleteItemsDto) {
    return this.logService.remove(deleteItemsDto.ids);
  }
}
