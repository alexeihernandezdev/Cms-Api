import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  async me(@CurrentUser() user: JwtUser) {
    const u = await this.usersService.findById(user.id);
    if (!u) {
      return null;
    }
    return this.usersService.sanitize(u);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar perfil propio' })
  async updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cambiar contraseña' })
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(user.id, dto);
    return { ok: true };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear usuario (DESDE ADMIN)' })
  async create(@Body() dto: CreateUserDto) {
    const roles = dto.roles && dto.roles.length > 0 ? dto.roles : [Role.USER];
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      roles,
      profile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      sections: dto.sections ?? [],
    });
    return this.usersService.sanitize(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar usuarios (ADMIN)' })
  async list() {
    const users = await this.usersService.findAll();
    return users.map((u) => this.usersService.sanitize(u));
  }
}
