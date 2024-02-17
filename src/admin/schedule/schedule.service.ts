import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Inject } from '@nestjs/common';
import { PoemService } from '../poem/poem.service';
import axios from 'axios';
import { aliOSS } from '../../core/utils/common';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(PoemService)
    private readonly poemService: PoemService,
  ) {}
  @Cron('3 3 3 * * *')
  async getPoem() {
    const res = await fetch('https://v1.hitokoto.cn');
    const data = await res.json();
    const { hitokoto: content, type, from: author } = data;
    await this.poemService.create({ content, type, author });
  }

  @Cron('2 2 2 * * *')
  async getBingImage() {
    const bing = await fetch(
      'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
    );
    const images = await bing.json();
    const url = 'http://www.bing.com' + images.images[0].url;
    const buffer = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const oss = aliOSS();
    const res = await oss.put(
      `/blog/cover/${new Date().getDate()}.jpg`,
      buffer.data,
    );
    console.log(res);
  }
}
