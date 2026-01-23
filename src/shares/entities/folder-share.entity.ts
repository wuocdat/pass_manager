import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Folder } from '../../folders/entities/folder.entity';
import { User } from '../../users/entities/user.entity';

@Entity('folder_shares')
@Unique(['folder', 'sharedWith'])
export class FolderShare {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Folder, (folder) => folder.shares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folder_id' })
  folder!: Folder;

  @ManyToOne(() => User, (user) => user.folderShares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shared_with' })
  sharedWith!: User;

  @Column({ type: 'text' })
  permission!: 'read' | 'edit';

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
