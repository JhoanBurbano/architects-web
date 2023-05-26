import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAWSPATH } from './config';

@Injectable()
export class S3Service {
  public BUCKET = this.configService.get<string>('AWS.BUCKET');
  public BUCKET_REGION = this.configService.get<string>('AWS.BUCKET_REGION');
  public SECRET_KEY = this.configService.get<string>('AWS.SECRET_KEY');
  public PUBLIC_ACCESS_KEY = this.configService.get<string>(
    'AWS.PUBLIC_ACCESS_KEY',
  );
  public QR_PATH = this.configService.get<string>('AWS.QR_PATH');

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  client = new S3Client({
    region: this.BUCKET,
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
    console.log('path', path);
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET,
      Key: path,
    });
    await this.client.send(command);
  }
}
