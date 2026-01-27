import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtFirstLoginStrategy extends PassportStrategy(Strategy, 'jwt-first-login') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_FIRST_LOGIN_SECRET') ??
        configService.get<string>('JWT_SECRET') ??
        'dev_secret',
    });
  }

  validate(payload: { sub: string; email: string; role: 'user' | 'admin'; first_login?: boolean }) {
    if (!payload.first_login) {
      throw new UnauthorizedException('First-login token required');
    }

    return { id: payload.sub, email: payload.email, role: payload.role, firstLogin: true };
  }
}
