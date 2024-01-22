import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { Model } from 'mongoose';
import * as Client from 'ali-oss';
import { InjectModel } from '@nestjs/mongoose';
import { getUnix } from '../../core/utils';

@Injectable()
export class FileService {
  constructor(
    @InjectModel('File')
    private readonly fileEntity: Model<FileEntity>,
  ) {}
  async signature() {
    const expiration = getUnix(5);
    const config = {
      accessKeyId: process.env.OSS_ALIYUN_KEY,
      accessKeySecret: process.env.OSS_ALIYUN_SECRET,
      dir: process.env.OSS_ALIYUN_DIR,
      bucket: process.env.OSS_ALIYUN_BUCKET,
    };

    const client = new Client(config);

    const policy = {
      expiration: expiration,
      conditions: [['content-length-range', 0, 10485760000]],
    };
    const formData = await client.calculatePostSignature(policy);
    const location = await client.getBucketLocation();
    const host = `http://${config.bucket}.${location.location}.aliyuncs.com`;

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

  async findAll({ page, limit }) {
    const [list, total] = await Promise.all([
      this.fileEntity
        .find()
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
    // const oss = aliOSS();
    // const result = await oss.delete(file.url);
    //
    // if (result.res.status !== 204) {
    //   throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    // }
    await this.fileEntity.findByIdAndDelete(id);
    return {
      data: null,
      message: '删除成功',
    };
  }
}
