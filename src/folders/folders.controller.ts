import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  private ensureAdmin(user: { role?: 'user' | 'admin' }) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }
  }

  @Post()
  create(
    @Body() dto: CreateFolderDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    if (dto.isPublic) {
      this.ensureAdmin(req.user);
    }
    return this.foldersService.create(dto, {
      id: req.user.id,
      role: req.user.role,
    });
  }

  @Get()
  findAll(@Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.foldersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.foldersService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    if (dto.isPublic === true) {
      this.ensureAdmin(req.user);
    }
    return this.foldersService.update(id, dto, {
      id: req.user.id,
      role: req.user.role,
    });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.foldersService.remove(id, req.user);
  }
}
