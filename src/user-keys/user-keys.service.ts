import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserKey } from './entities/user-key.entity';
import { User } from '../users/entities/user.entity';
import { CreateUserKeyDto } from './dto/user-key.dto';

@Injectable()
export class UserKeysService {
  constructor(
    @InjectRepository(UserKey) private readonly keysRepo: Repository<UserKey>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserKeyDto) {
    const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const key = this.keysRepo.create({
      user,
      wrappedMasterKey: dto.wrappedMasterKey,
      kdfSalt: dto.kdfSalt,
      kdfParams: dto.kdfParams,
      keyVersion: dto.keyVersion ?? 1,
    });
    return this.keysRepo.save(key);
  }

  findAll() {
    return this.keysRepo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const key = await this.keysRepo.findOne({ where: { id }, relations: ['user'] });
    if (!key) {
      throw new NotFoundException('User key not found');
    }
    return key;
  }

  async remove(id: string) {
    const key = await this.keysRepo.findOne({ where: { id } });
    if (!key) {
      throw new NotFoundException('User key not found');
    }
    await this.keysRepo.remove(key);
    return { deleted: true };
  }
}
