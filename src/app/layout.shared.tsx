import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { Icons } from '@/components/icons/icons';
import { CastleIcon, MessageSquareIcon, YoutubeIcon } from 'lucide-react';
import type { JSX } from 'react';

export type Social = {
  icon: JSX.Element;
  name: string;
  url: string;
  description?: string;
};

export const title = 'Anirudh';
export const description =
  'A powerful platform to streamline your business operations.';
export const owner = 'Tech With Anirudh';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title,
  },
  githubUrl: 'https://github.com/techwithanirudh/shadcn-saas-landing',
};

export const linkItems: LinkItemType[] = [
  {
    icon: <Icons.info />,
    text: 'About',
    url: '/about',
    active: 'url',
  },
  {
    icon: <Icons.phone />,
    text: 'Contact',
    url: '/contact',
    active: 'url',
  },
  {
    type: 'menu',
    text: 'Blog',
    items: [
      {
        text: 'Posts',
        description: 'View all blog posts',
        url: '/blog',
        icon: <Icons.posts />,
      },
      {
        text: 'Tags',
        description: 'View blog posts by tags',
        url: '/tags',
        icon: <Icons.tags />,
      },
      {
        text: 'Newsletter',
        description: 'Subscribe to our newsletter',
        url: '/newsletter',
        icon: <Icons.mail />,
      },
    ],
  },
];

export const socials: Social[] = [
  {
    icon: <Icons.globe />,
    name: "Anirudh's Arena",
    url: 'https://community.techwithanirudh.com/u/anirudh',
    description: "My profile on the Anirudh's Arena forum.",
  },
  {
    icon: <CastleIcon />,
    name: 'Chess.com',
    url: 'https://www.chess.com/member/diamonds_and_netherite',
    description: 'Follow my chess journey and games on Chess.com',
  },
  {
    name: 'AMC Forum',
    description: 'My profile on the Active Member Chat forum',
    url: 'https://amcforum.wiki/u/geo/activity',
    icon: <MessageSquareIcon />,
  },
  {
    name: 'YouTube',
    description:
      'Subscribe to my YouTube channel for chess and entertainment content',
    url: 'https://www.youtube.com/@i-use-chess-.-com',
    icon: <YoutubeIcon />,
  },
];

export const postsPerPage = 5;
