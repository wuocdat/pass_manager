import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ChangePasswordGuard extends AuthGuard('jwt-first-login') {}
