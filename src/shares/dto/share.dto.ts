import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';

export class CreatePasswordShareDto {
  @ApiProperty({ example: 'password-uuid' })
  @IsUUID()
  passwordId!: string;

  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  sharedWith!: string;

  @ApiProperty({ enum: ['read', 'edit'] })
  @IsString()
  @IsIn(['read', 'edit'])
  permission!: 'read' | 'edit';
}

export class CreateFolderShareDto {
  @ApiProperty({ example: 'folder-uuid' })
  @IsUUID()
  folderId!: string;

  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  sharedWith!: string;

  @ApiProperty({ enum: ['read', 'edit'] })
  @IsString()
  @IsIn(['read', 'edit'])
  permission!: 'read' | 'edit';
}
