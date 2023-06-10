import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoginDTO } from '../dto/login.dto';
import { CreateUserDto, User, UserDocument } from '../schemas/user.schema';
import { JwtTokenService } from './jwt.service';
import { tokenDTO } from '../dto/token.dto';
import { PasswordDTO } from '../dto/password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(userDTO: CreateUserDto) {
    const _user = new this.userModel(userDTO);
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
  }

  async login(credentials: LoginDTO) {
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
  }

  async delete(user: tokenDTO) {
    const { _id } = user;
    const objectId = new Types.ObjectId(_id);

    return await this.userModel.findByIdAndDelete(objectId);
  }

  async changePassword(data: PasswordDTO) {
    const { password, token } = data;
    const { email } = this.jwtTokenService.verifyToken(token);
    const user = await this.userModel.findOne({ email });
    user.password = password;
    return await user.save();
  }
}
