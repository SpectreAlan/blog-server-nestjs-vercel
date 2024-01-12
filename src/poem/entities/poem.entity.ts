import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class PoemEntity {
  @Prop({ required: true, unique: true })
  content: string;

  @Prop()
  author: string;

  @Prop()
  type: string;
}

export const PoemSchema = SchemaFactory.createForClass(PoemEntity);
