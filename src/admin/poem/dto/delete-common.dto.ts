import { IsArray, IsMongoId } from 'class-validator';

export class DeleteItemsDto {
  @IsArray()
  @IsMongoId({ each: true })
  ids: string[];
}
