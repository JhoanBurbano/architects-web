import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './services/AWS/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './services/jwt.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb+srv://${config.get<string>(
          'MONGO.USER',
        )}:${config.get<string>(
          'MONGO.PASSWORD',
        )}@miprimercluster.uvknu.mongodb.net/${config.get<string>(
          'MONGO.DATABASE',
        )}?retryWrites=true&w=majority`,
        useNewUrlParser: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('CONFIG.SECRET_HASH_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('CONFIG.EXPIRES_IN'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
