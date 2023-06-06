import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async getProperties() {
    return await this.propertyModel.find();
  }

  async getPropertyById(id: string) {
    return await this.propertyModel.findById(id);
  }
}
