import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TagEntity {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description: string;
}

export const TagSchema = SchemaFactory.createForClass(TagEntity);
