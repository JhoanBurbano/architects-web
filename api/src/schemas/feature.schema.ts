import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FeatureDocument = HydratedDocument<Feature>;

@Schema()
export class Feature {
  @Prop({ type: Number, required: true })
  levels: number;

  @Prop({ type: Number, required: true })
  rooms: number;

  @Prop({ type: Number, required: true })
  baths: number;

  @Prop({ type: Boolean, required: true })
  garage: boolean;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
