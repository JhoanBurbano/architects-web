import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../services/profile.service';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from '../services/AWS/aws.service';
import { JwtTokenService } from '../services/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, JwtTokenService, JwtService, S3Service],
})
export class ProfileModule {}
