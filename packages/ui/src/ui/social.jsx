import React from 'react';
import {
  IconWorld,
  IconBrandFacebook,
  IconBrandX,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconBrandGithub,
  IconBrandPinterest,
} from './icons';

// ─── Social platform registry ──────────────────────────────────────────────
// Single source of truth shared by every UI app. The `key` is the stable id
// stored in an app's `contact.social` map ({ facebook: "https://…" }) and is
// what selects the icon. Add or remove a platform by editing this one array —
// it updates every consumer's picker and display at once. Stored keys not in
// this list still render (via the IconWorld fallback), so removing an entry is
// always backward-safe.
export const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: IconBrandFacebook },
  { key: 'x', label: 'X', icon: IconBrandX },
  { key: 'instagram', label: 'Instagram', icon: IconBrandInstagram },
  { key: 'linkedin', label: 'LinkedIn', icon: IconBrandLinkedin },
  { key: 'youtube', label: 'YouTube', icon: IconBrandYoutube },
  { key: 'tiktok', label: 'TikTok', icon: IconBrandTiktok },
  { key: 'whatsapp', label: 'WhatsApp', icon: IconBrandWhatsapp },
  { key: 'telegram', label: 'Telegram', icon: IconBrandTelegram },
  { key: 'github', label: 'GitHub', icon: IconBrandGithub },
  { key: 'pinterest', label: 'Pinterest', icon: IconBrandPinterest },
];

const BY_KEY = new Map(SOCIAL_PLATFORMS.map((p) => [p.key, p]));

// Resolve a stored social key to its platform entry (or undefined if custom).
export function socialPlatform(key) {
  return BY_KEY.get(String(key ?? '').toLowerCase());
}

// Resolve a stored social key to its icon component, falling back to a generic
// globe for custom/unknown keys so display never breaks.
export function socialIcon(key) {
  return socialPlatform(key)?.icon ?? IconWorld;
}

// Human label for a key — registry label, else the raw key.
export function socialLabel(key) {
  return socialPlatform(key)?.label ?? key;
}

// Renders the matching brand icon for a social key (globe fallback).
export function SocialIcon({ platform, size = 18, ...props }) {
  const Icon = socialIcon(platform);
  return <Icon size={size} {...props} />;
}
