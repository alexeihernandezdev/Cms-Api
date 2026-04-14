import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

@Schema({ _id: false })
export class UserProfile {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;
}

const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  })
  roles: Role[];

  @Prop({ type: UserProfileSchema, default: {} })
  profile: UserProfile;

  @Prop({ type: [String], default: [] })
  sections: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
