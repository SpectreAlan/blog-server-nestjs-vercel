import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AuthEntity {
  @Prop({ required: true, unique: true })
  account: string;

  @Prop()
  @Prop({ default: '' })
  password: string;

  @Prop()
  nickName: string;

  @Prop()
  avatar: string;

  @Prop()
  email: string;

  @Prop()
  role: string;

  @Prop({ default: 1 })
  status: number;
}

export const AuthSchema = SchemaFactory.createForClass(AuthEntity);
