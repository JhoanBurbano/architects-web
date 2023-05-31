import { DataTemplateDTO } from 'src/dto/data-templates.dto';
import { SubjectEmail } from 'src/enums/subject-email.enum';

export const Messages: Record<SubjectEmail, (data: DataTemplateDTO) => string> =
  {
    [SubjectEmail.FORGOT_PASSWORD]: (data: DataTemplateDTO) => {
      return ``;
    },
    [SubjectEmail.WELCOME]: (data: DataTemplateDTO) => ``,
  };
