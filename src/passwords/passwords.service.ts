import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Password } from './entities/password.entity';
import { User } from '../users/entities/user.entity';
import { Folder } from '../folders/entities/folder.entity';
import { CreatePasswordDto, UpdatePasswordDto } from './dto/password.dto';

@Injectable()
export class PasswordsService {
  constructor(
    @InjectRepository(Password) private readonly passwordsRepo: Repository<Password>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Folder) private readonly foldersRepo: Repository<Folder>,
  ) {}

  async create(dto: CreatePasswordDto, requester: { id: string; role: 'user' | 'admin' }) {
    const owner = await this.usersRepo.findOne({ where: { id: requester.id } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    let folder: Folder | null = null;
    if (dto.folderId) {
      folder = await this.foldersRepo.findOne({
        where:
          requester.role === 'admin'
            ? { id: dto.folderId }
            : { id: dto.folderId, owner: { id: requester.id } },
      });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    const encryptionMeta = { ...dto.encryptionMeta } as Record<string, unknown>;
    const password = this.passwordsRepo.create({
      owner,
      folder,
      title: dto.title,
      username: dto.username ?? null,
      passwordEncrypted: dto.passwordEncrypted,
      url: dto.url ?? null,
      notes: dto.notes ?? null,
      encryptionMeta,
      isPublic: dto.isPublic ?? false,
    });
    return this.passwordsRepo.save(password);
  }

  findAll(requester: { id: string; role: 'user' | 'admin' }) {
    if (requester.role === 'admin') {
      return this.passwordsRepo.find({ relations: ['owner', 'folder'] });
    }
    return this.passwordsRepo.find({
      where: { owner: { id: requester.id } },
      relations: ['owner', 'folder'],
    });
  }

  async findOne(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const password = await this.passwordsRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, owner: { id: requester.id } },
      relations: ['owner', 'folder'],
    });
    if (!password) {
      throw new NotFoundException('Password not found');
    }
    return password;
  }

  async update(
    id: string,
    dto: UpdatePasswordDto,
    requester: { id: string; role: 'user' | 'admin' },
  ) {
    const password = await this.passwordsRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, owner: { id: requester.id } },
    });
    if (!password) {
      throw new NotFoundException('Password not found');
    }

    if (dto.folderId !== undefined) {
      if (dto.folderId === null) {
        password.folder = null;
      } else {
        const folder = await this.foldersRepo.findOne({
          where:
            requester.role === 'admin'
              ? { id: dto.folderId }
              : { id: dto.folderId, owner: { id: requester.id } },
        });
        if (!folder) {
          throw new NotFoundException('Folder not found');
        }
        password.folder = folder;
      }
    }

    if (dto.title !== undefined) {
      password.title = dto.title;
    }

    if (dto.username !== undefined) {
      password.username = dto.username ?? null;
    }

    if (dto.passwordEncrypted !== undefined) {
      password.passwordEncrypted = dto.passwordEncrypted;
    }

    if (dto.url !== undefined) {
      password.url = dto.url ?? null;
    }

    if (dto.notes !== undefined) {
      password.notes = dto.notes ?? null;
    }

    if (dto.encryptionMeta !== undefined) {
      password.encryptionMeta = { ...dto.encryptionMeta } as Record<string, unknown>;
    }

    if (dto.isPublic !== undefined) {
      password.isPublic = dto.isPublic;
    }

    return this.passwordsRepo.save(password);
  }

  async remove(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const password = await this.passwordsRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, owner: { id: requester.id } },
    });
    if (!password) {
      throw new NotFoundException('Password not found');
    }
    await this.passwordsRepo.remove(password);
    return { deleted: true };
  }
}
