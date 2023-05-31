import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SubjectEmail } from 'src/enums/subject-email.enum';
import { TemplateEmail } from 'src/enums/template-email.enum';

export class EmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  subject: SubjectEmail;

  @IsString()
  @IsNotEmpty()
  message: TemplateEmail;
}
