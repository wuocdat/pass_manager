import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto, UpdatePasswordDto } from './dto/password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('passwords')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  private ensureAdmin(user: { role?: 'user' | 'admin' }) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }
  }

  @Post()
  create(
    @Body() dto: CreatePasswordDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    if (dto.isPublic) {
      this.ensureAdmin(req.user);
    }
    return this.passwordsService.create(dto, {
      id: req.user.id,
      role: req.user.role,
    });
  }

  @Get()
  findAll(@Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.passwordsService.findAll(req.user);
  }

  @Get('folder/:folderId')
  findByFolder(
    @Param('folderId') folderId: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.passwordsService.findByFolder(folderId, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.passwordsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    if (dto.isPublic === true) {
      this.ensureAdmin(req.user);
    }
    return this.passwordsService.update(id, dto, {
      id: req.user.id,
      role: req.user.role,
    });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.passwordsService.remove(id, req.user);
  }
}
