import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class VisitorEntity {
  @Prop({ required: true })
  ip: string;

  @Prop()
  device: string;

  @Prop()
  os: string;

  @Prop()
  browser: string;

  @Prop()
  organization: string;

  @Prop()
  country: string;

  @Prop()
  province: string;

  @Prop()
  city: string;
}

export const VisitorSchema = SchemaFactory.createForClass(VisitorEntity);
