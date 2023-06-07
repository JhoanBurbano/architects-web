import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from '../services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtTokenService } from '../services/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../services/email.service';
import { S3Service } from '../services/AWS/aws.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UsersService,
    JwtTokenService,
    JwtService,
    EmailService,
    S3Service,
  ],
})
export class UserModule {}
