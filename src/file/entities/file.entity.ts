import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class FileEntity {
  @Prop({ required: true, unique: true })
  url: string;

  @Prop()
  description: string;
}

export const FileSchema = SchemaFactory.createForClass(FileEntity);
