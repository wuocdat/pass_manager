import { ApiProperty } from '@nestjs/swagger';

export class CreatePasswordShareDto {
  @ApiProperty({ example: 'password-uuid' })
  passwordId!: string;

  @ApiProperty({ example: 'user-uuid' })
  sharedWith!: string;

  @ApiProperty({ enum: ['read', 'edit'] })
  permission!: 'read' | 'edit';
}

export class CreateFolderShareDto {
  @ApiProperty({ example: 'folder-uuid' })
  folderId!: string;

  @ApiProperty({ example: 'user-uuid' })
  sharedWith!: string;

  @ApiProperty({ enum: ['read', 'edit'] })
  permission!: 'read' | 'edit';
}
