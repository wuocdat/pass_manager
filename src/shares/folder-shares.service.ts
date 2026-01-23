import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderShare } from './entities/folder-share.entity';
import { Folder } from '../folders/entities/folder.entity';
import { User } from '../users/entities/user.entity';
import { CreateFolderShareDto } from './dto/share.dto';

@Injectable()
export class FolderSharesService {
  constructor(
    @InjectRepository(FolderShare)
    private readonly sharesRepo: Repository<FolderShare>,
    @InjectRepository(Folder)
    private readonly foldersRepo: Repository<Folder>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateFolderShareDto, requester: { id: string; role: 'user' | 'admin' }) {
    const folder = await this.foldersRepo.findOne({
      where:
        requester.role === 'admin'
          ? { id: dto.folderId }
          : { id: dto.folderId, owner: { id: requester.id } },
      relations: ['owner'],
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    const sharedWith = await this.usersRepo.findOne({ where: { id: dto.sharedWith } });
    if (!sharedWith) {
      throw new NotFoundException('User not found');
    }

    const share = this.sharesRepo.create({
      folder,
      sharedWith,
      permission: dto.permission,
    });
    return this.sharesRepo.save(share);
  }

  findAll(requester: { id: string; role: 'user' | 'admin' }) {
    if (requester.role === 'admin') {
      return this.sharesRepo.find({ relations: ['folder', 'sharedWith'] });
    }
    return this.sharesRepo.find({
      where: { folder: { owner: { id: requester.id } } },
      relations: ['folder', 'sharedWith'],
    });
  }

  async findOne(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const share = await this.sharesRepo.findOne({
      where:
        requester.role === 'admin'
          ? { id }
          : { id, folder: { owner: { id: requester.id } } },
      relations: ['folder', 'sharedWith'],
    });
    if (!share) {
      throw new NotFoundException('Folder share not found');
    }
    return share;
  }

  async remove(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const share = await this.sharesRepo.findOne({
      where:
        requester.role === 'admin'
          ? { id }
          : { id, folder: { owner: { id: requester.id } } },
    });
    if (!share) {
      throw new NotFoundException('Folder share not found');
    }
    await this.sharesRepo.remove(share);
    return { deleted: true };
  }
}
