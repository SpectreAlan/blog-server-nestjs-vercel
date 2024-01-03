export class Category {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CategoryEntity {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity).set(
  'timestamps',
  {
    currentTime: () => Math.floor(Date.now()),
  },
);
