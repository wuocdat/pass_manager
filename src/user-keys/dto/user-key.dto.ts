import { ApiProperty } from '@nestjs/swagger';

export class CreateUserKeyDto {
  @ApiProperty({ example: 'user-uuid' })
  userId!: string;

  @ApiProperty({ example: 'wrapped_key_base64' })
  wrappedMasterKey!: string;

  @ApiProperty({ example: 'salt_base64' })
  kdfSalt!: string;

  @ApiProperty({ example: { algorithm: 'argon2id', memory: 65536 } })
  kdfParams!: Record<string, unknown>;

  @ApiProperty({ required: false, default: 1 })
  keyVersion?: number;
}
