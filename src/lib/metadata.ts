import { owner } from '@/app/layout.config';
import type { Metadata } from 'next/types';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    creator: owner,
    publisher: owner,
    formatDetection: {
      telephone: false,
      ...override.formatDetection,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
    },
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://winter.techwithanirudh.com',
      images: '/banner.png',
      siteName: 'Kyle',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@AnirudhWith',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': '/api/rss.xml',
      },
      ...override.alternates,
    },
  };
}
