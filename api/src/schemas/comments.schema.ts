import { HydratedDocument, Schema as _Schema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Property } from './property.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: _Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: _Schema.Types.ObjectId, ref: 'Property' })
  property: Property;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
