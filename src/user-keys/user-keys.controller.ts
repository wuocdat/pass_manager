import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserKeysService } from './user-keys.service';
import { CreateUserKeyDto } from './dto/user-key.dto';

@ApiTags('user-keys')
@Controller('user-keys')
export class UserKeysController {
  constructor(private readonly userKeysService: UserKeysService) {}

  @Post()
  create(@Body() dto: CreateUserKeyDto) {
    return this.userKeysService.create(dto);
  }

  @Get()
  findAll() {
    return this.userKeysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userKeysService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userKeysService.remove(id);
  }
}
