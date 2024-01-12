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
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

@Controller('file')
@UseInterceptors(ResponseInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.fileService.uploadFile(file, uploadFileDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.fileService.findAll({ page, limit });
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.fileService.remove(id);
  }
}
