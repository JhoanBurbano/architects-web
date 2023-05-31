import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAWSPATH } from './config';
import { Readable } from 'stream';
import { TemplateEmail } from 'src/enums/template-email.enum';

@Injectable()
export class S3Service {
  public BUCKET = this.configService.get<string>('AWS.BUCKET');
  public BUCKET_REGION = this.configService.get<string>('AWS.BUCKET_REGION');
  public SECRET_KEY = this.configService.get<string>('AWS.SECRET_KEY');
  public PUBLIC_ACCESS_KEY = this.configService.get<string>(
    'AWS.PUBLIC_ACCESS_KEY',
  );
  public TEMPLATE_PATH = this.configService.get<string>('AWS.TEMPLATE_PATH');
  public QR_PATH = this.configService.get<string>('AWS.QR_PATH');

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  client = new S3Client({
    region: this.BUCKET_REGION,
    credentials: {
      accessKeyId: this.PUBLIC_ACCESS_KEY,
      secretAccessKey: this.SECRET_KEY,
    },
  });

  async uploadFile(file: any, folder = 'profiles/') {
    const uploadParams = {
      Bucket: this.BUCKET,
      Key: `${this.QR_PATH}${folder}${file.name}.png`,
      Body: file.data,
      ContentType: 'image/png',
      ACL: 'public-read',
    };
    const command = new PutObjectCommand(uploadParams);
    await this.client.send(command);
    return getAWSPATH(folder, file.name);
  }

  async deleteFile(id: string) {
    const path = `${this.QR_PATH}${id}.png`;
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET,
      Key: path,
    });
    await this.client.send(command);
  }

  async getTemplate(template: TemplateEmail) {
    const path = `${this.TEMPLATE_PATH}${template}.mjml`;
    const command = new GetObjectCommand({
      Bucket: this.BUCKET,
      Key: path,
    });
    const response = await this.client.send(command);
    const bodyStream = response.Body as Readable;
    let mjmlTemplate = '';
    for await (const chunk of bodyStream) {
      mjmlTemplate += chunk;
    }

    return mjmlTemplate;
  }
}
