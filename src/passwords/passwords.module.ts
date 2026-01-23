import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordsController } from './passwords.controller';
import { PasswordsService } from './passwords.service';
import { Password } from './entities/password.entity';
import { User } from '../users/entities/user.entity';
import { Folder } from '../folders/entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Password, User, Folder])],
  controllers: [PasswordsController],
  providers: [PasswordsService],
})
export class PasswordsModule {}
