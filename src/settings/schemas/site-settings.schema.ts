import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

@Schema({ _id: false })
export class WebsiteData {
  @Prop({ default: '' })
  title: string;

  @Prop({ default: '' })
  description: string;
}

export const WebsiteDataSchema = SchemaFactory.createForClass(WebsiteData);

@Schema({ _id: false })
export class ContactInfo {
  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  address: string;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);

@Schema({ _id: false })
export class SocialNetworks {
  @Prop({ default: '' })
  facebook: string;

  @Prop({ default: '' })
  twitter: string;

  @Prop({ default: '' })
  instagram: string;

  @Prop({ default: '' })
  linkedin: string;
}

export const SocialNetworksSchema = SchemaFactory.createForClass(SocialNetworks);

@Schema({ timestamps: true, collection: 'sitesettings' })
export class SiteSettings {
  @Prop({ type: WebsiteDataSchema, default: () => ({}) })
  websiteData: WebsiteData;

  @Prop({ type: ContactInfoSchema, default: () => ({}) })
  contactInfo: ContactInfo;

  @Prop({ type: SocialNetworksSchema, default: () => ({}) })
  socialNetworks: SocialNetworks;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
