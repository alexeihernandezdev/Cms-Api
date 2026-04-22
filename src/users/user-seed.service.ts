import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';

@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.usersService.countDocuments();
    if (count > 0) {
      return;
    }

    const email = this.config.get<string>('SEED_ADMIN_EMAIL')?.trim();
    const password = this.config.get<string>('SEED_ADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.warn(
        'Base de datos sin usuarios: define SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD para crear el administrador inicial, o crea un usuario por otra vía.',
      );
      return;
    }

    if (password.length < 8 || password.length > 128) {
      throw new Error(
        'SEED_ADMIN_PASSWORD debe tener entre 8 y 128 caracteres (base de datos vacía).',
      );
    }

    await this.usersService.create({
      email,
      password,
      roles: [Role.ADMIN],
      profile: {},
      sections: [],
    });
    this.logger.log(`Usuario administrador inicial creado (${email})`);
  }
}
