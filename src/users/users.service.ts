import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash: dto.passwordHash,
      fullName: dto.fullName ?? null,
      isActive: dto.isActive ?? true,
    });
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.usersRepo.merge(user, {
      email: dto.email ?? user.email,
      passwordHash: dto.passwordHash ?? user.passwordHash,
      fullName: dto.fullName ?? user.fullName,
      isActive: dto.isActive ?? user.isActive,
    });
    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepo.remove(user);
    return { deleted: true };
  }
}
