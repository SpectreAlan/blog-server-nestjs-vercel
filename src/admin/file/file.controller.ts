import {
  Controller,
  Get,
  Post,
  UploadedFile,
  Param,
  Delete,
  UseInterceptors,
  Body,
  Query,
} from '@nestjs/common';
import { Express } from 'express';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

@Controller('file')
@UseInterceptors(ResponseInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('signature')
  async signature() {
    return this.fileService.signature();
  }

  @Get()
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
  ) {
    return this.fileService.findAll({ page, limit });
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.fileService.remove(id);
  }
}
