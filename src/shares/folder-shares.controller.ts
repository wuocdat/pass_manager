import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FolderSharesService } from './folder-shares.service';
import { CreateFolderShareDto } from './dto/share.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('folder-shares')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('folder-shares')
export class FolderSharesController {
  constructor(private readonly folderSharesService: FolderSharesService) {}

  @Post()
  create(
    @Body() dto: CreateFolderShareDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.folderSharesService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.folderSharesService.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.folderSharesService.findOne(id, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.folderSharesService.remove(id, req.user);
  }
}
