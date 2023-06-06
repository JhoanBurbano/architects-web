import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtTokenService } from 'src/services/jwt.service';
import { S3Service } from './AWS/aws.service';
import { updateProfileDTO } from 'src/dto/update-profile.dto';
import { FileUpload } from 'express-fileupload';
import { UserKeysType } from 'src/interfaces/user-keys.interface';
@Injectable()
export class ProfileService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private s3Service: S3Service,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getProfile(token: string) {
    try {
      const { _id } = this.jwtTokenService.verifyToken(token);
      const user = await this.userModel.findById(_id, {
        password: 0,
        comments: 0,
        favorites: 0,
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFullProfile(token: string, include: UserKeysType[]) {
    try {
      const { _id } = this.jwtTokenService.verifyToken(token);
      const user = await this.userModel.findById(_id, {
        password: 0,
        comments: 0,
        favorites: 0,
      });
      return {
        user: this.includeProps(user, ...include),
        cards: [],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadImage(file: FileUpload, token: string) {
    try {
      const { _id } = this.jwtTokenService.verifyToken(token);
      if (_id) {
        file.name = _id;
        const url = await this.s3Service.uploadFile(file, 'profiles');
        return { url };
      }
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  }
  async updateProfile(profile: updateProfileDTO) {
    try {
      const user = await this.userModel.findById(profile.id);
      delete profile['id'];
      Object.keys(profile).forEach((prop) => (user[prop] = profile[prop]));
      const _user = await user.save();
      delete _user.password;
      return this.includeProps(_user, 'name', 'lastname');
    } catch (error) {
      throw new Error(error);
    }
  }

  private excludeProps(user: User, ...exclude: string[]) {
    const _user = { ...user };
    const props = ['password', ...exclude];

    props.forEach((prop) => {
      if (_user.hasOwnProperty(prop)) {
        delete _user[prop];
      }
    });

    return _user;
  }

  private includeProps(user: User, ...include: UserKeysType[]) {
    const _user = {};

    include.forEach((prop) => {
      if (!!user[prop]) {
        _user[prop] = user[prop];
      }
    });
    return _user;
  }
}
