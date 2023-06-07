import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { tokenDTO } from '../dto/token.dto';

@Injectable()
export class JwtTokenService {
  private secret = this.configService.get<string>('CONFIG.SECRET_HASH_KEY');
  private expiresIn = '1h';
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(data: tokenDTO) {
    const token = this.jwtService.sign(data, {
      secret: this.secret,
      expiresIn: this.expiresIn,
    });
    return {
      token,
      expiresIn: this.expiresIn,
    };
  }

  generateTokenPassword(email: string) {
    return this.jwtService.sign(
      { email },
      {
        secret: this.secret,
        expiresIn: '15m',
      },
    );
  }

  verifyToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.secret,
      });
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
