import { HydratedDocument, Schema as _Schema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { TypeProperty } from 'src/enums/type-property.enum';
import { City } from 'src/constants/cities.constants';
import { FeatureSchema, Feature } from './feature.schema';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ type: TypeProperty })
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
  commets: Comment[];

  @Prop({ type: FeatureSchema, required: true })
  features: Feature;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
