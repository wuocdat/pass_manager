import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UserKey } from '../user-keys/entities/user-key.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(UserKey) private readonly userKeysRepo: Repository<UserKey>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const stored = user.passwordHash ?? '';
    const isBcrypt = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');
    const ok = isBcrypt ? await bcrypt.compare(password, stored) : stored === password;

    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const existingKey = await this.userKeysRepo
      .createQueryBuilder('uk')
      .select([
        'uk.id',
        'uk.wrappedMasterKey',
        'uk.kdfSalt',
        'uk.kdfParams',
        'uk.keyVersion',
      ])
      .where('uk.user_id = :userId', { userId: user.id })
      .orderBy('uk.key_version', 'DESC')
      .addOrderBy('uk.created_at', 'DESC')
      .getOne();

    if (!existingKey) {
      const firstLoginSecret =
        this.configService.get<string>('JWT_FIRST_LOGIN_SECRET') ??
        this.configService.get<string>('JWT_SECRET') ??
        'dev_secret';
      return {
        access_token: await this.jwtService.signAsync(
          { ...payload, first_login: true, typ: 'first-login' },
          { secret: firstLoginSecret, expiresIn: '15m' },
        ),
        must_change_password: true,
      };
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
      user_key: existingKey
        ? {
            id: existingKey.id,
            wrappedMasterKey: existingKey.wrappedMasterKey,
            kdfSalt: existingKey.kdfSalt,
            kdfParams: existingKey.kdfParams,
            keyVersion: existingKey.keyVersion,
          }
        : null,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    return this.usersRepo.manager.transaction(async (manager) => {
      const usersRepo = manager.getRepository(User);
      const keysRepo = manager.getRepository(UserKey);
      const user = await usersRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      const keyVersion = dto.userKey.keyVersion ?? 1;
      const existingKey = await keysRepo
        .createQueryBuilder('uk')
        .select(['uk.id'])
        .where('uk.user_id = :userId', { userId })
        .andWhere('uk.key_version = :keyVersion', { keyVersion })
        .getOne();
      if (existingKey) {
        throw new ConflictException('User key version already exists');
      }

      user.passwordHash = await bcrypt.hash(dto.password, 10);
      await usersRepo.save(user);

      const key = keysRepo.create({
        user,
        wrappedMasterKey: dto.userKey.wrappedMasterKey,
        kdfSalt: dto.userKey.kdfSalt,
        kdfParams: dto.userKey.kdfParams,
        keyVersion,
      });
      await keysRepo.save(key);

      return { updated: true, user_key_id: key.id };
    });
  }
}
