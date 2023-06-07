import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { S3Service } from './AWS/aws.service';
import { JwtTokenService } from './jwt.service';
import { Property, PropertyDocument } from '../schemas/property.schema';
import * as uuid from 'uuid';
import { FileUpload } from 'express-fileupload';
import { createPropertyDTO } from '../dto/create-property.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { cities } from '../constants/cities.constants';

@Injectable()
export class PropertyService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private s3Service: S3Service,
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async uploadFiles(files: FileUpload[]) {
    const paths = [];
    try {
      for (const file of files) {
        file.name = uuid.v4();
        const url = await this.s3Service.uploadFile(file, 'homes');
        paths.push(url);
      }
      return paths;
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  }

  async createProperty(data: createPropertyDTO) {
    const { token, property: document } = data;
    try {
      const { _id } = this.jwtTokenService.verifyToken(token);
      const _property = new this.propertyModel({ ...document, assesor: _id });
      const property = await _property.save();
      delete property['comments'];
      return property;
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  }

  getCities = () => cities;

  async getPropertiesByAssesor(assesorId: string): Promise<Property[]> {
    const objectId = new Types.ObjectId(assesorId);
    const properties = await this.propertyModel.aggregate([
      {
        $match: {
          assesor: { $eq: objectId },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assesor',
          foreignField: '_id',
          as: 'assesor',
        },
      },
      {
        $unwind: '$assesor',
      },
      {
        $project: {
          type: 1,
          city: 1,
          sector: 1,
          likes: 1,
          images: 1,
          description: 1,
          tags: 1,
          isActive: 1,
          features: 1,
          'assesor.name': 1,
          'assesor.lastname': 1,
          'assesor.email': 1,
        },
      },
    ]);
    return properties as Property[];
  }

  async deletePropertyById(propertyId: string) {
    await this.propertyModel.findByIdAndDelete(propertyId);
    await this.userModel.updateMany(
      { favorites: { $in: [propertyId] } },
      { $pullAll: { favorites: [propertyId] } },
    );

    return { message: 'ok' };
  }
}
