import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  businessName: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
