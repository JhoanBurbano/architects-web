import {
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { ROL } from '../enums/rol.enum';

export class updateProfileDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  profile: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  rol: ROL;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsEmpty()
  password?: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
