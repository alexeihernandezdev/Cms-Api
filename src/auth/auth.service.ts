import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      roles: [Role.USER],
      profile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    const token = await this.signUser(user.id, user.email, user.roles);
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const token = await this.signUser(user.id, user.email, user.roles);
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  private async signUser(
    userId: string,
    email: string,
    roles: Role[],
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      roles,
    };
    return this.jwtService.signAsync(payload);
  }
}
