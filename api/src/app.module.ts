import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './services/AWS/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { PropertyModule } from './property/property.module';
import { Property, PropertySchema } from './schemas/property.schema';

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
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    UserModule,
    ProfileModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
