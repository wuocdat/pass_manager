import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordShare } from './entities/password-share.entity';
import { Password } from '../passwords/entities/password.entity';
import { User } from '../users/entities/user.entity';
import { CreatePasswordShareDto } from './dto/share.dto';

@Injectable()
export class PasswordSharesService {
  constructor(
    @InjectRepository(PasswordShare)
    private readonly sharesRepo: Repository<PasswordShare>,
    @InjectRepository(Password)
    private readonly passwordsRepo: Repository<Password>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreatePasswordShareDto) {
    const password = await this.passwordsRepo.findOne({ where: { id: dto.passwordId } });
    if (!password) {
      throw new NotFoundException('Password not found');
    }
    const sharedWith = await this.usersRepo.findOne({ where: { id: dto.sharedWith } });
    if (!sharedWith) {
      throw new NotFoundException('User not found');
    }

    const share = this.sharesRepo.create({
      password,
      sharedWith,
      permission: dto.permission,
    });
    return this.sharesRepo.save(share);
  }

  findAll() {
    return this.sharesRepo.find({ relations: ['password', 'sharedWith'] });
  }

  async findOne(id: string) {
    const share = await this.sharesRepo.findOne({
      where: { id },
      relations: ['password', 'sharedWith'],
    });
    if (!share) {
      throw new NotFoundException('Password share not found');
    }
    return share;
  }

  async remove(id: string) {
    const share = await this.sharesRepo.findOne({ where: { id } });
    if (!share) {
      throw new NotFoundException('Password share not found');
    }
    await this.sharesRepo.remove(share);
    return { deleted: true };
  }
}
