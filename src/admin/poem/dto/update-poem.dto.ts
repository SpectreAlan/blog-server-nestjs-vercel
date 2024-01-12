import { PartialType } from '@nestjs/mapped-types';
import { CreatePoemDto } from './create-poem.dto';

export class UpdatePoemDto extends PartialType(CreatePoemDto) {}
