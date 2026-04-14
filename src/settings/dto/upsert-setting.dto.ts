import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpsertSettingDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  key: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50000)
  value: string;
}
