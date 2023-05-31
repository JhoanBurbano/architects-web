import { IsMongoId, IsNotEmpty } from 'class-validator';

export class tokenDTO {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;
}
