import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from 'src/services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtTokenService } from 'src/services/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/services/email.service';
import { S3Service } from 'src/services/AWS/aws.service';

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
