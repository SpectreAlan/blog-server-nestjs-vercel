import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserEntity {
  @Prop({ required: true, unique: true })
  account: string;

  @Prop({ default: '' })
  password: string;

  @Prop()
  nickName: string;

  @Prop()
  avatar: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  pushDeer: string;

  @Prop()
  role: string;

  @Prop({ default: 1 })
  status: number;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
