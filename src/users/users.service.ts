import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { UpdatePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: {
    email: string;
    password: string;
    roles?: Role[];
    profile?: { firstName?: string; lastName?: string };
    sections?: string[];
  }): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }
    const hash = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({
      email: data.email,
      password: hash,
      roles: data.roles ?? [Role.USER],
      profile: data.profile ?? {},
      sections: data.sections ?? [],
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() });
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+password');
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ email: 1 }).exec();
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (dto.firstName !== undefined) {
      user.profile = user.profile ?? {};
      user.profile.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      user.profile = user.profile ?? {};
      user.profile.lastName = dto.lastName;
    }
    if (dto.sections !== undefined) {
      user.sections = dto.sections;
    }
    await user.save();
    return this.sanitize(user);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const ok = await bcrypt.compare(dto.currentPassword, user.password);
    if (!ok) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
  }

  sanitize(user: UserDocument) {
    const o = user.toObject();
    const { password: _unused, ...rest } = o as unknown as {
      password?: string;
      [key: string]: unknown;
    };
    void _unused;
    return rest;
  }
}
