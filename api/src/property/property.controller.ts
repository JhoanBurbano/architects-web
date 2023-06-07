import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertyDTO } from '../dto/create-property.dto';
import { PropertyService } from '../services/property.service';
import { FileUpload } from 'express-fileupload';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get('cities')
  getCities() {
    return this.propertyService.getCities();
  }

  @Get('/:id')
  async getPropertiesById(@Param('id') id: string) {
    try {
      return await this.propertyService.getPropertiesByAssesor(id);
    } catch (error) {
      console.log('error', error);
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

  @Post('upload-files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: FileUpload[]) {
    try {
      return await this.propertyService.uploadFiles(files);
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

  @Post('create-property')
  async createProperty(
    @Headers('auth') token: string,
    @Body() property: PropertyDTO,
  ) {
    try {
      return await this.propertyService.createProperty({ token, property });
    } catch (error) {
      console.log('error', error);
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

  @Delete('delete-property/:id')
  async deleteProperty(@Param('id') id: string) {
    try {
      return await this.propertyService.deletePropertyById(id);
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
}
