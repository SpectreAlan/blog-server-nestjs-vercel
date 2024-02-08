import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class LogEntity {
  @Prop()
  ip: string;

  @Prop()
  url: string;

  @Prop()
  query: string;

  @Prop()
  body: string;

  @Prop()
  method: string;

  @Prop()
  userAgent: string;

  @Prop()
  message: string;

  @Prop()
  status: number;
}

export const LogSchema = SchemaFactory.createForClass(LogEntity);
