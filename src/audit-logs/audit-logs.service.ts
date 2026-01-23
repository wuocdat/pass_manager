import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
import { CreateAuditLogDto } from './dto/audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog) private readonly logsRepo: Repository<AuditLog>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateAuditLogDto, requester: { id: string; role: 'user' | 'admin' }) {
    let user: User | null = null;
    if (dto.userId) {
      if (requester.role !== 'admin' && dto.userId !== requester.id) {
        throw new NotFoundException('User not found');
      }
      user = await this.usersRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const log = this.logsRepo.create({
      user: user ?? null,
      action: dto.action,
      targetType: dto.targetType ?? null,
      targetId: dto.targetId ?? null,
    });
    return this.logsRepo.save(log);
  }

  findAll(requester: { id: string; role: 'user' | 'admin' }) {
    if (requester.role === 'admin') {
      return this.logsRepo.find({ relations: ['user'] });
    }
    return this.logsRepo.find({
      where: { user: { id: requester.id } },
      relations: ['user'],
    });
  }

  async findOne(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const log = await this.logsRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, user: { id: requester.id } },
      relations: ['user'],
    });
    if (!log) {
      throw new NotFoundException('Audit log not found');
    }
    return log;
  }
}
