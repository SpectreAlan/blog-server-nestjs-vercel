import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  Body,
  Query,
  UsePipes,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('file')
@UseInterceptors(ResponseInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('signature')
  async signature() {
    return this.fileService.signature();
  }

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() uploadFileDto: UploadFileDto) {
    return this.fileService.create(uploadFileDto);
  }

  @Get()
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('url') url: string,
    @Query('description') description: string,
  ) {
    return this.fileService.findAll({ page, limit, url, description });
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.fileService.remove(id);
  }
}
