import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TagEntity {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description: string;
}

export const TagSchema = SchemaFactory.createForClass(TagEntity).set(
  'timestamps',
  {
    currentTime: () => Math.floor(Date.now()),
  },
);
