import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import {
  SiteSettings,
  SiteSettingsDocument,
} from './schemas/site-settings.schema';

export type SiteSettingsPayload = {
  websiteData: {
    title: string;
    description: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialNetworks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
};

const DEFAULTS: SiteSettingsPayload = {
  websiteData: {
    title: '',
    description: '',
  },
  contactInfo: {
    email: '',
    phone: '',
    address: '',
  },
  socialNetworks: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
  },
};

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly siteSettingsModel: Model<SiteSettingsDocument>,
  ) {}

  async get(): Promise<SiteSettingsPayload> {
    const doc = await this.siteSettingsModel.findOne().lean();
    return this.toPayload(doc);
  }

  async upsert(dto: UpdateSiteSettingsDto): Promise<SiteSettingsPayload> {
    const current = await this.siteSettingsModel.findOne().lean();
    const base = this.toPayload(current);
    const merged = mergePatch(base, dto);
    const saved = await this.siteSettingsModel.findOneAndUpdate(
      {},
      merged,
      { upsert: true, new: true },
    );
    return this.toPayload(saved.toObject());
  }

  private toPayload(
    doc: Record<string, unknown> | SiteSettings | null | undefined,
  ): SiteSettingsPayload {
    if (!doc || typeof doc !== 'object') {
      return structuredClone(DEFAULTS);
    }
    const w = doc['websiteData'] as Record<string, string> | undefined;
    const c = doc['contactInfo'] as Record<string, string> | undefined;
    const s = doc['socialNetworks'] as Record<string, string> | undefined;
    return {
      websiteData: {
        title: w?.title ?? '',
        description: w?.description ?? '',
      },
      contactInfo: {
        email: c?.email ?? '',
        phone: c?.phone ?? '',
        address: c?.address ?? '',
      },
      socialNetworks: {
        facebook: s?.facebook ?? '',
        twitter: s?.twitter ?? '',
        instagram: s?.instagram ?? '',
        linkedin: s?.linkedin ?? '',
      },
    };
  }
}

function mergePatch(
  base: SiteSettingsPayload,
  dto: UpdateSiteSettingsDto,
): SiteSettingsPayload {
  return {
    websiteData: {
      ...base.websiteData,
      ...(dto.websiteData ?? {}),
    },
    contactInfo: {
      ...base.contactInfo,
      ...(dto.contactInfo ?? {}),
    },
    socialNetworks: {
      ...base.socialNetworks,
      ...(dto.socialNetworks ?? {}),
    },
  };
}
