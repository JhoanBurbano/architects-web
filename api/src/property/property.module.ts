import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from 'src/schemas/property.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from 'src/services/AWS/aws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from 'src/services/jwt.service';
import { PropertyService } from 'src/services/property.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PropertyController],
  providers: [S3Service, JwtService, JwtTokenService, PropertyService],
})
export class PropertyModule {}
