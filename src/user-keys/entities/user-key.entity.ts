import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_keys')
@Unique(['user', 'keyVersion'])
export class UserKey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.keys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text', name: 'wrapped_master_key' })
  wrappedMasterKey!: string;

  @Column({ type: 'text', name: 'kdf_salt' })
  kdfSalt!: string;

  @Column({ type: 'jsonb', name: 'kdf_params' })
  kdfParams!: Record<string, unknown>;

  @Column({ type: 'int', name: 'key_version', default: 1 })
  keyVersion!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
}
