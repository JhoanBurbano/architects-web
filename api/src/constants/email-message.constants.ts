import { DataTemplateDTO } from '../dto/data-templates.dto';
import { SubjectEmail } from '../enums/subject-email.enum';

export const Messages: Record<SubjectEmail, (data: DataTemplateDTO) => string> =
  {
    [SubjectEmail.FORGOT_PASSWORD]: (data: DataTemplateDTO) => {
      return ``;
    },
    [SubjectEmail.WELCOME]: (data: DataTemplateDTO) => ``,
  };
