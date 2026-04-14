import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../common/enums/role.enum';
import { JwtUser } from '../common/interfaces/jwt-user.interface';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('JWT_SECRET') ?? 'change-me-in-development',
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }
}
