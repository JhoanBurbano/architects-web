import { IsJWT, IsString } from 'class-validator';
import { Property } from '../schemas/property.schema';

export class createPropertyDTO {
  @IsJWT()
  @IsString()
  token: string;

  property: PropertyDTO;
}

export type PropertyDTO = Omit<Property, '_id'>;
