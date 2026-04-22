import { ApiProperty } from '@nestjs/swagger';

export class WebsiteDataResponseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class ContactInfoResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;
}

export class SocialNetworksResponseDto {
  @ApiProperty()
  facebook: string;

  @ApiProperty()
  twitter: string;

  @ApiProperty()
  instagram: string;

  @ApiProperty()
  linkedin: string;
}

export class SiteSettingsResponseDto {
  @ApiProperty({ type: WebsiteDataResponseDto })
  websiteData: WebsiteDataResponseDto;

  @ApiProperty({ type: ContactInfoResponseDto })
  contactInfo: ContactInfoResponseDto;

  @ApiProperty({ type: SocialNetworksResponseDto })
  socialNetworks: SocialNetworksResponseDto;
}
