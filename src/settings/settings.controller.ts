import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SiteSettingsResponseDto } from './dto/site-settings-response.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Configuración del sitio (sin autenticación)' })
  @ApiOkResponse({ type: SiteSettingsResponseDto })
  findPublic() {
    return this.settingsService.get();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configuración del sitio (ADMIN)' })
  @ApiOkResponse({ type: SiteSettingsResponseDto })
  findOne() {
    return this.settingsService.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar configuración del sitio (ADMIN)' })
  @ApiOkResponse({ type: SiteSettingsResponseDto })
  upsert(@Body() dto: UpdateSiteSettingsDto) {
    return this.settingsService.upsert(dto);
  }
}
