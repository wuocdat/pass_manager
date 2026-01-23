import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserKey } from '../../user-keys/entities/user-key.entity';
import { Folder } from '../../folders/entities/folder.entity';
import { Password } from '../../passwords/entities/password.entity';
import { PasswordShare } from '../../shares/entities/password-share.entity';
import { FolderShare } from '../../shares/entities/folder-share.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Exclude()
  @Column({ type: 'text', name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'text', name: 'full_name', nullable: true })
  fullName?: string | null;

  @Column({ type: 'text', default: 'user' })
  role!: 'user' | 'admin';

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => UserKey, (userKey) => userKey.user)
  keys?: UserKey[];

  @OneToMany(() => Folder, (folder) => folder.owner)
  folders?: Folder[];

  @OneToMany(() => Password, (password) => password.owner)
  passwords?: Password[];

  @OneToMany(() => PasswordShare, (share) => share.sharedWith)
  passwordShares?: PasswordShare[];

  @OneToMany(() => FolderShare, (share) => share.sharedWith)
  folderShares?: FolderShare[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs?: AuditLog[];
}
