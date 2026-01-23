import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FolderSharesService } from './folder-shares.service';
import { CreateFolderShareDto } from './dto/share.dto';

@ApiTags('folder-shares')
@Controller('folder-shares')
export class FolderSharesController {
  constructor(private readonly folderSharesService: FolderSharesService) {}

  @Post()
  create(@Body() dto: CreateFolderShareDto) {
    return this.folderSharesService.create(dto);
  }

  @Get()
  findAll() {
    return this.folderSharesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.folderSharesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folderSharesService.remove(id);
  }
}
