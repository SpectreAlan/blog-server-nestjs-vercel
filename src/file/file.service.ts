import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as OSS from 'ali-oss';
import { Express } from 'express';
import { FileEntity } from './entities/file.entity';
import { Model } from 'mongoose';
import { UploadFileDto } from './dto/upload-file.dto';
import { getAliOSSConfig } from '../core/utils';
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class FileService {

  constructor(
    @InjectModel('File')
    private readonly fileEntity: Model<FileEntity>) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    info: UploadFileDto,
  ) {
    const client = new OSS(getAliOSSConfig());

    const result = await client.put(
      `/blog/${info.type}/${new Date().getTime()}.${
        file.originalname.split('/')[1]
      }`,
      file.buffer,
    );

    const create = await this.fileEntity.create({
      url: result.url,
      description: info.description,
    });
    const data = await create.save();
    return {
      data,
      message: '上传成功',
    };
  }

  async findAll({ page, limit }) {
    const [list, total] = await Promise.all([
      this.fileEntity
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.fileEntity.countDocuments().exec(),
    ]);

    return { data: { total, list } };
  }

  async remove(id: string) {
    const file = await this.fileEntity.findById(id);
    if (!file) {
      throw new HttpException('文件不存在', HttpStatus.BAD_REQUEST);
    }
    const oss = new OSS(getAliOSSConfig());
    const result = await oss.delete(file.url);

    if (result.res.status !== 204) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
    await this.fileEntity.findByIdAndDelete(id);
    return {
      data: null,
      message: '删除成功',
    };
  }
}
