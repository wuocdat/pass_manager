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

  async create(dto: CreateFolderShareDto) {
    const folder = await this.foldersRepo.findOne({ where: { id: dto.folderId } });
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

  findAll() {
    return this.sharesRepo.find({ relations: ['folder', 'sharedWith'] });
  }

  async findOne(id: string) {
    const share = await this.sharesRepo.findOne({
      where: { id },
      relations: ['folder', 'sharedWith'],
    });
    if (!share) {
      throw new NotFoundException('Folder share not found');
    }
    return share;
  }

  async remove(id: string) {
    const share = await this.sharesRepo.findOne({ where: { id } });
    if (!share) {
      throw new NotFoundException('Folder share not found');
    }
    await this.sharesRepo.remove(share);
    return { deleted: true };
  }
}
