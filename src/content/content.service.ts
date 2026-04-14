import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { JwtUser } from '../common/interfaces/jwt-user.interface';
import { CreateContentDto } from './dto/create-content.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './schemas/content.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  private scopeFilter(user: JwtUser) {
    if (user.roles.includes(Role.ADMIN)) {
      return {};
    }
    return {
      $or: [
        { author: new Types.ObjectId(user.id) },
        { ownerEmail: user.email.toLowerCase() },
      ],
    };
  }

  async create(user: JwtUser, dto: CreateContentDto) {
    const doc = new this.contentModel({
      title: dto.title,
      body: dto.body ?? '',
      type: dto.type,
      status: dto.status ?? undefined,
      author: new Types.ObjectId(user.id),
      ownerEmail: user.email.toLowerCase(),
      keywords: dto.keywords ?? [],
      links: dto.links ?? [],
      refs: dto.refs ?? [],
    });
    const saved = await doc.save();
    return this.findOneById(user, saved._id.toString());
  }

  async findMany(user: JwtUser, query: QueryContentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const conditions: Record<string, unknown>[] = [];
    const scope = this.scopeFilter(user);
    if (Object.keys(scope).length > 0) {
      conditions.push(scope);
    }
    if (query.status) {
      conditions.push({ status: query.status });
    }
    if (query.type) {
      conditions.push({ type: query.type });
    }
    if (query.search?.trim()) {
      const term = query.search.trim();
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      conditions.push({
        $or: [
          { title: new RegExp(safe, 'i') },
          { keywords: new RegExp(safe, 'i') },
        ],
      });
    }
    const filter =
      conditions.length === 0
        ? {}
        : conditions.length === 1
          ? conditions[0]
          : { $and: conditions };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.contentModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'email profile')
        .lean()
        .exec(),
      this.contentModel.countDocuments(filter),
    ]);
    return {
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOneById(user: JwtUser, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Contenido no encontrado');
    }
    const filter = { _id: new Types.ObjectId(id), ...this.scopeFilter(user) };
    const doc = await this.contentModel
      .findOne(filter)
      .populate('author', 'email profile')
      .lean()
      .exec();
    if (!doc) {
      throw new NotFoundException('Contenido no encontrado');
    }
    return doc;
  }

  async update(user: JwtUser, id: string, dto: UpdateContentDto) {
    const existing = await this.contentModel.findOne({
      _id: new Types.ObjectId(id),
      ...this.scopeFilter(user),
    });
    if (!existing) {
      throw new NotFoundException('Contenido no encontrado');
    }
    Object.assign(existing, dto);
    await existing.save();
    return this.findOneById(user, id);
  }

  async remove(user: JwtUser, id: string) {
    const existing = await this.contentModel.findOne({
      _id: new Types.ObjectId(id),
      ...this.scopeFilter(user),
    });
    if (!existing) {
      throw new NotFoundException('Contenido no encontrado');
    }
    await existing.deleteOne();
    return { ok: true };
  }
}
