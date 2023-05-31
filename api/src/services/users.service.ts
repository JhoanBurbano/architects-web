import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoginDTO } from 'src/dto/login.dto';
import { CreateUserDto, User, UserDocument } from 'src/schemas/user.schema';
import { JwtTokenService } from './jwt.service';
import { tokenDTO } from 'src/dto/token.dto';
import { PasswordDTO } from 'src/dto/password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(userDTO: CreateUserDto) {
    console.log('userDTO', userDTO);
    const _user = new this.userModel(userDTO);
    try {
      const user = await _user.save();
      return {
        dataUser: {
          auth: this.jwtTokenService.generateToken({ _id: user._id }),
          id: user.id,
          name: `${user.name} ${user.lastname}`,
          email: user.email,
          rol: user.rol,
        },
        message: 'USER REGISTERED',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(credentials: LoginDTO) {
    try {
      const { email, password } = credentials;
      const user = await this.userModel.findOne({ email });
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!user || !isValidPassword) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return {
        dataUser: {
          auth: this.jwtTokenService.generateToken({ _id: user._id }),
          id: user.id,
          name: `${user.name} ${user.lastname}`,
          email: user.email,
          rol: user.rol,
        },
        message: 'USER LOGGED',
      };
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  }

  async delete(user: tokenDTO) {
    const { _id } = user;
    const objectId = new Types.ObjectId(_id);

    return await this.userModel.findByIdAndDelete(objectId);
  }

  async changePassword(data: PasswordDTO) {
    try {
      const { password, token } = data;
      const { email } = this.jwtTokenService.verifyToken(token);
      const user = await this.userModel.findOne({ email });
      user.password = password;
      return await user.save();
    } catch (error) {
      console.log('error', error);
    }
  }
}