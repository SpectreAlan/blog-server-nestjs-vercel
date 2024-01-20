import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class DeleteItemsDto {
  @IsArray({ message: 'ids字段必须是一个 sting[]' })
  @IsMongoId({ each: true, message: 'id格式不正确' })
  @IsNotEmpty({ message: 'ids cannot be an empty array' })
  ids: MongooseSchema.Types.ObjectId[];
}
