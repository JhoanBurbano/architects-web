import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';
import { PasswordDTO } from '../dto/password.dto';
import { SubjectEmail } from '../enums/subject-email.enum';
import { TemplateEmail } from '../enums/template-email.enum';
import { CreateUserDto } from '../schemas/user.schema';
import { EmailService } from '../services/email.service';
import { JwtTokenService } from '../services/jwt.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
export class UserController {
  constructor(
    private usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    console.log('user', user);
    try {
      return await this.usersService.register(user);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 'AR103',
          message: 'Hubo un error al registrar el usuario',
          error: 'USER_NO_REGISTERED',
          _error: error,
        },
        400,
      );
    }
  }

  @Post('login')
  async login(@Body() credentials: LoginDTO) {
    try {
      return await this.usersService.login(credentials);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 'AR104',
          message: 'Error en sus credenciales',
          error: 'USER_INVALID',
          _error: error,
        },
        400,
      );
    }
  }
  @Patch('change-password')
  async changePassword(@Body() data: PasswordDTO) {
    try {
      await this.usersService.changePassword(data);
      return true;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 'AR106',
          message: 'Hubo un error al enviar el email',
          error: 'PASSWORD-NOT-CHANGED',
          _error: error,
        },
        400,
      );
    }
  }

  @Get('forgot-password')
  async forgotPassword(@Query('email') email: string) {
    try {
      return await this.emailService.sendEmail({
        email,
        subject: SubjectEmail.FORGOT_PASSWORD,
        name: 'Jhoan',
        lastname: 'Burbano',
        message: TemplateEmail.FORGOT_PASSWORD,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 'AR105',
          message: 'Hubo un error al enviar el email',
          error: 'EMAIL_NO_SENT',
          _error: error,
        },
        400,
      );
    }
  }

  @Get('verify-token')
  verifyTokenPassword(@Query('token') token: string) {
    return !!this.jwtTokenService.verifyToken(token);
  }
}
