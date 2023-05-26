import {
  Headers,
  Inject,
  Injectable,
  NestMiddleware,
  Next,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';

@Injectable()
export class MiddlewareMiddleware implements NestMiddleware {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}
  use(@Headers() headers: Headers, res: Response, @Next() next: NextFunction) {
    if (headers) {
      console.log('headers', headers);
    }
    next();
  }
}
