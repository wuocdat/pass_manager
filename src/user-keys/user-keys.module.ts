import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKeysController } from './user-keys.controller';
import { UserKeysService } from './user-keys.service';
import { UserKey } from './entities/user-key.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserKey, User])],
  controllers: [UserKeysController],
  providers: [UserKeysService],
})
export class UserKeysModule {}
