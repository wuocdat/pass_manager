import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PasswordSharesService } from './password-shares.service';
import { CreatePasswordShareDto } from './dto/share.dto';

@ApiTags('password-shares')
@Controller('password-shares')
export class PasswordSharesController {
  constructor(private readonly passwordSharesService: PasswordSharesService) {}

  @Post()
  create(@Body() dto: CreatePasswordShareDto) {
    return this.passwordSharesService.create(dto);
  }

  @Get()
  findAll() {
    return this.passwordSharesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordSharesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordSharesService.remove(id);
  }
}
