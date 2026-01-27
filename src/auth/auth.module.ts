import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/entities/user.entity';
import { UserKey } from '../user-keys/entities/user-key.entity';
import { JwtFirstLoginStrategy } from './jwt-first-login.strategy';
import { ChangePasswordGuard } from './change-password.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserKey]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'dev_secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtFirstLoginStrategy, ChangePasswordGuard],
})
export class AuthModule {}
