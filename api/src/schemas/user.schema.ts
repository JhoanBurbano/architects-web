import { Document, HydratedDocument, Schema as _Schema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Property } from './property.schema';
import { UserStatus } from '../enums/user-status.enum';
import { ROL } from 'src/enums/rol.enum';
import bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

export type CreateUserDto = Omit<User, '_id'>;

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    default:
      'https://burbanostudio-assets.s3.us-east-2.amazonaws.com/projects/ARCHITECTS/assets/no-profile.png',
  })
  profile: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  rol: ROL;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [{ type: _Schema.Types.ObjectId, ref: 'Property' }],
    default: [],
  })
  favorites: Property[];

  @Prop()
  description: string;

  @Prop()
  status: UserStatus;

  @Prop({ type: [{ type: _Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});
