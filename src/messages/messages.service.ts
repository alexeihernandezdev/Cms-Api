import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(dto: CreateMessageDto) {
    const doc = new this.messageModel({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      message: dto.message,
      phone: dto.phone ?? '',
      businessName: dto.businessName ?? '',
    });
    return doc.save();
  }

  async findMany(query: QueryMessagesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};
    if (query.email?.trim()) {
      filter.email = query.email.toLowerCase().trim();
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.messageModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.messageModel.countDocuments(filter),
    ]);
    return {
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async remove(id: string) {
    const res = await this.messageModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Mensaje no encontrado');
    }
    return { ok: true };
  }
}
