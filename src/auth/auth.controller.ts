import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordGuard } from './change-password.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { id: string; email: string; role: 'user' | 'admin' } }) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(ChangePasswordGuard)
  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: { user: { id: string } }) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
