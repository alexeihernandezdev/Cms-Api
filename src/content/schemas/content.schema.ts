import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum ContentType {
  Post = 'Post',
  SERVICES = 'SERVICES',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export type ContentDocument = HydratedDocument<Content>;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  body: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(ContentType),
    required: true,
  })
  type: ContentType;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  author: Types.ObjectId;

  /** Duplicado del email del autor para consultas y regla multiusuario */
  @Prop({ required: true, lowercase: true, index: true })
  ownerEmail: string;

  @Prop({
    type: String,
    enum: Object.values(ContentStatus),
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ type: [String], default: [] })
  links: string[];

  @Prop({ type: [String], default: [] })
  refs: string[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
