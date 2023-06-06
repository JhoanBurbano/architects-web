import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from 'src/services/profile.service';
import { FileUpload } from 'express-fileupload';
import { updateProfileDTO } from 'src/dto/update-profile.dto';
import { UserKeysType } from 'src/interfaces/user-keys.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  async getProfile(@Headers('auth') token: string) {
    try {
      return await this.profileService.getProfile(token);
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        {
          statusCode: 'AR105',
          message: 'Hubo un error al registrar el usuario',
          error: 'USER_NO_REGISTERED',
          _error: error,
        },
        400,
      );
    }
  }

  @Get('full')
  async getFullProfile(
    @Headers('auth') token: string,
    @Query('include') include: string,
  ) {
    try {
      return await this.profileService.getFullProfile(
        token,
        include.split(',') as UserKeysType[],
      );
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        {
          statusCode: 'AR105',
          message: 'Hubo un error al registrar el usuario',
          error: 'USER_NO_REGISTERED',
          _error: error,
        },
        400,
      );
    }
  }

  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfile(
    @UploadedFile() file: FileUpload,
    @Headers('auth') token: string,
  ) {
    try {
      const url = await this.profileService.uploadImage(file, token);
      return url;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        {
          statusCode: 'AR105',
          message: 'Hubo un error al registrar el usuario',
          error: 'USER_NO_REGISTERED',
          _error: error,
        },
        400,
      );
    }
  }

  @Put(':id')
  async updateProfile(@Param('id') id: string, @Body() user: updateProfileDTO) {
    try {
      return await this.profileService.updateProfile({ ...user, id });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 'AR105',
          message: 'Hubo un error al registrar el usuario',
          error: 'USER_NO_REGISTERED',
          _error: error,
        },
        400,
      );
    }
  }
}
