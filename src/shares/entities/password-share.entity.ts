import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Password } from '../../passwords/entities/password.entity';
import { User } from '../../users/entities/user.entity';

@Entity('password_shares')
@Unique(['password', 'sharedWith'])
export class PasswordShare {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Password, (password) => password.shares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'password_id' })
  password!: Password;

  @ManyToOne(() => User, (user) => user.passwordShares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shared_with' })
  sharedWith!: User;

  @Column({ type: 'text' })
  permission!: 'read' | 'edit';

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
