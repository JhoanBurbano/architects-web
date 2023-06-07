import { HydratedDocument, Schema as _Schema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { TypeProperty } from '../enums/type-property.enum';
import { City } from '../constants/cities.constants';
import { FeatureSchema, Feature } from './feature.schema';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ type: String })
  type: TypeProperty;

  @Prop({ type: String })
  city: City;

  @Prop({ type: _Schema.Types.ObjectId, ref: 'User' })
  assesor: User;

  @Prop({ type: String })
  sector: string;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Array<string> })
  images: string[];

  @Prop()
  description: string;

  @Prop()
  tags: string[];

  @Prop({ type: Boolean, default: true })
  isActive: string[];

  @Prop({ type: [{ type: _Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: FeatureSchema, required: true })
  features: Feature;

  @Prop({
    type: Number,
    required: true,
    max: 1000000,
    min: 80000,
    default: 80000,
  })
  price: number;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
