import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Folder } from '../../folders/entities/folder.entity';
import { PasswordShare } from '../../shares/entities/password-share.entity';

@Entity('passwords')
export class Password {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.passwords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @ManyToOne(() => Folder, (folder) => folder.passwords, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'folder_id' })
  folder?: Folder | null;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  username?: string | null;

  @Column({ type: 'text', name: 'password_encrypted' })
  passwordEncrypted!: string;

  @Column({ type: 'text', nullable: true })
  url?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'jsonb', name: 'encryption_meta' })
  encryptionMeta!: Record<string, unknown>;

  @Column({ type: 'boolean', name: 'is_public', default: false })
  isPublic!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => PasswordShare, (share) => share.password)
  shares?: PasswordShare[];
}
