import { IsJWT, IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  confirmPassword: string;

  @IsNotEmpty()
  @IsJWT()
  token: string;
}
