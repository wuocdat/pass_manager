import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordSharesController } from './password-shares.controller';
import { PasswordSharesService } from './password-shares.service';
import { FolderSharesController } from './folder-shares.controller';
import { FolderSharesService } from './folder-shares.service';
import { PasswordShare } from './entities/password-share.entity';
import { FolderShare } from './entities/folder-share.entity';
import { Password } from '../passwords/entities/password.entity';
import { Folder } from '../folders/entities/folder.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordShare, FolderShare, Password, Folder, User])],
  controllers: [PasswordSharesController, FolderSharesController],
  providers: [PasswordSharesService, FolderSharesService],
})
export class SharesModule {}
