import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { SocialNetworksDto } from './social-networks.dto';
import { WebsiteDataDto } from './website-data.dto';

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional({ type: WebsiteDataDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WebsiteDataDto)
  websiteData?: WebsiteDataDto;

  @ApiPropertyOptional({ type: ContactInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;

  @ApiPropertyOptional({ type: SocialNetworksDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialNetworksDto)
  socialNetworks?: SocialNetworksDto;
}
