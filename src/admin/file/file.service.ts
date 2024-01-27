import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { Model } from 'mongoose';
const OSS = require('ali-oss');
import { InjectModel } from '@nestjs/mongoose';
import { UploadFileDto } from './dto/upload-file.dto';
import { aliOSS } from '../../core/utils/common';

@Injectable()
export class FileService {
  constructor(
    @InjectModel('File')
    private readonly fileEntity: Model<FileEntity>,
  ) {}

  async signature() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const expiration = date.toISOString();
    const config = {
      accessKeyId: process.env.OSS_ALIYUN_KEY,
      accessKeySecret: process.env.OSS_ALIYUN_SECRET,
      dir: process.env.OSS_ALIYUN_DIR,
      bucket: process.env.OSS_ALIYUN_BUCKET,
    };

    const client = new OSS(config);

    const policy = {
      expiration,
      conditions: [['content-length-range', 0, 10485760000]],
    };
    const formData = await client.calculatePostSignature(policy);
    const location = await client.getBucketLocation();
    const host = `https://${config.bucket}.${location.location}.aliyuncs.com`;

    return {
      data: {
        expire: expiration,
        policy: formData.policy,
        signature: formData.Signature,
        accessId: formData.OSSAccessKeyId,
        host,
        dir: config.dir,
      },
      message: 'success',
    };
  }

  async create(uploadFileDto: UploadFileDto) {
    try {
      const create = await this.fileEntity.create(uploadFileDto);
      await create.save();
      return {
        message: '添加成功',
        data: null,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('文件已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll({ page, limit, url, description }) {
    const query: any = {};
    if (url) {
      query.url = { $regex: new RegExp(url, 'i') };
    }
    if (description) {
      query.description = { $regex: new RegExp(description, 'i') };
    }
    const [list, total] = await Promise.all([
      this.fileEntity
        .find(query)
        .sort({ createdAt: -1 })
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
    const oss = aliOSS();
    const result = await oss.delete(file.url.replace('image-base-url/', ''));

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
