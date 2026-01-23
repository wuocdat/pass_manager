import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/audit-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  create(
    @Body() dto: CreateAuditLogDto,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.auditLogsService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: { user: { id: string; role: 'user' | 'admin' } }) {
    return this.auditLogsService.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string; role: 'user' | 'admin' } },
  ) {
    return this.auditLogsService.findOne(id, req.user);
  }
}
