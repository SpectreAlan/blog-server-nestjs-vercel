export class Setting {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class SettingEntity {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop()
  value: string;

  @Prop({ default: 'system' })
  type: string;
}

export const SettingSchema = SchemaFactory.createForClass(SettingEntity);
