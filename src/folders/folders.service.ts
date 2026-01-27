import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { User } from '../users/entities/user.entity';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder) private readonly foldersRepo: Repository<Folder>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateFolderDto, requester: { id: string; role: 'user' | 'admin' }) {
    const owner = await this.usersRepo.findOne({ where: { id: requester.id } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    let parent: Folder | null = null;
    if (dto.parentId) {
      parent = await this.foldersRepo.findOne({
        where:
          requester.role === 'admin'
            ? { id: dto.parentId }
            : { id: dto.parentId, owner: { id: requester.id } },
      });
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const folder = this.foldersRepo.create({
      owner,
      parent,
      name: dto.name,
      description: dto.description ?? null,
      isPublic: dto.isPublic ?? false,
    });
    return this.foldersRepo.save(folder);
  }

  findAll(requester: { id: string; role: 'user' | 'admin' }) {
    const qb = this.foldersRepo
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.owner', 'owner')
      .leftJoinAndSelect('folder.parent', 'parent')
      .loadRelationCountAndMap('folder.passwordCount', 'folder.passwords');

    if (requester.role !== 'admin') {
      qb.where('owner.id = :ownerId', { ownerId: requester.id });
    }

    return qb.getMany();
  }

  async findOne(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const folder = await this.foldersRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, owner: { id: requester.id } },
      relations: ['owner', 'parent'],
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    return folder;
  }

  async update(
    id: string,
    dto: UpdateFolderDto,
    requester: { id: string; role: 'user' | 'admin' },
  ) {
    const folder = await this.foldersRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, owner: { id: requester.id } },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === null) {
        folder.parent = null;
      } else {
        const parent = await this.foldersRepo.findOne({
          where:
            requester.role === 'admin'
              ? { id: dto.parentId }
              : { id: dto.parentId, owner: { id: requester.id } },
        });
        if (!parent) {
          throw new NotFoundException('Parent folder not found');
        }
        folder.parent = parent;
      }
    }

    if (dto.name !== undefined) {
      folder.name = dto.name;
    }

    if (dto.description !== undefined) {
      folder.description = dto.description ?? null;
    }

    if (dto.isPublic !== undefined) {
      folder.isPublic = dto.isPublic;
    }

    return this.foldersRepo.save(folder);
  }

  async remove(id: string, requester: { id: string; role: 'user' | 'admin' }) {
    const folder = await this.foldersRepo.findOne({
      where:
        requester.role === 'admin' ? { id } : { id, owner: { id: requester.id } },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    await this.foldersRepo.remove(folder);
    return { deleted: true };
  }
}
