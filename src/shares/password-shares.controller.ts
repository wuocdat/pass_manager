import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PasswordSharesService } from './password-shares.service';
import { CreatePasswordShareDto } from './dto/share.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('password-shares')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('password-shares')
export class PasswordSharesController {
  constructor(private readonly passwordSharesService: PasswordSharesService) {}

  @Post()
  create(
    @Body() dto: CreatePasswordShareDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.passwordSharesService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.passwordSharesService.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.passwordSharesService.findOne(id, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.passwordSharesService.remove(id, req.user);
  }
}
