import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CommentEntity {
  @Prop({ unique: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Article',
    required: true,
  })
  article: MongooseSchema.Types.ObjectId;

  @Prop()
  nickName: string;

  @Prop()
  email: string;

  @Prop()
  parentId: string;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);
