import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TagService } from '../admin/tag/tag.service';

@Injectable()
export class BlogService {
  constructor(
    @Inject(TagService)
    private readonly tagService: TagService,
  ) {}
}
