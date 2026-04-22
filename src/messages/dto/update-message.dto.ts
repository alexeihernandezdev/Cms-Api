import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @ApiPropertyOptional({ description: 'Marcar mensaje como leído o no leído' })
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
