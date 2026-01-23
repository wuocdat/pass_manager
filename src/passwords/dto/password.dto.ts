import { ApiProperty } from '@nestjs/swagger';

export class CreatePasswordDto {
  @ApiProperty({ example: 'owner-uuid' })
  ownerId!: string;

  @ApiProperty({ required: false, example: 'folder-uuid' })
  folderId?: string;

  @ApiProperty({ example: 'Gmail' })
  title!: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ example: 'encrypted_base64' })
  passwordEncrypted!: string;

  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ example: { algorithm: 'aes-256-gcm', iv: 'base64', tag: 'base64' } })
  encryptionMeta!: Record<string, unknown>;

  @ApiProperty({ required: false, default: false })
  isPublic?: boolean;
}

export class UpdatePasswordDto {
  @ApiProperty({ required: false })
  folderId?: string | null;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  passwordEncrypted?: string;

  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  encryptionMeta?: Record<string, unknown>;

  @ApiProperty({ required: false })
  isPublic?: boolean;
}
