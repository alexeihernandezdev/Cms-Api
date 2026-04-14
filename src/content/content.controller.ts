import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('content')
@ApiBearerAuth()
@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear contenido (author y ownerEmail desde JWT)' })
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateContentDto) {
    return this.contentService.create(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar con paginación y filtros' })
  findAll(@CurrentUser() user: JwtUser, @Query() query: QueryContentDto) {
    return this.contentService.findMany(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener por id (alcance USER/ADMIN)' })
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.contentService.findOneById(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar' })
  update(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: UpdateContentDto,
  ) {
    return this.contentService.update(user, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar' })
  remove(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.contentService.remove(user, id);
  }
}
