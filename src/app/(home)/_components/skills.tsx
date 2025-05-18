'use client';

import { Section } from '@/components/section';
import { Badge } from '@/components/ui/badge';
import { ViewAnimation } from '@/components/view-animation';
import { cva } from 'class-variance-authority';
import { HandshakeIcon, PenIcon, UserRoundCogIcon } from 'lucide-react';

// Create a variant for feature items
const featureItemVariants = cva(
  'group flex flex-col justify-between gap-10 p-6 last:border-border last:border-b last:border-dashed hover:bg-card hover:bg-card/80 sm:gap-22 md:gap-34 lg:gap-46',
  {
    variants: {
      size: {
        sm: '',
        lg: 'lg:col-span-2',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

const features = [
  {
    id: 1,
    Icon: UserRoundCogIcon,
    title: 'Forum Moderation',
    description:
      'Expert management of online communities ensuring productive discussions.',
    size: 'sm',
  },
  {
    id: 2,
    Icon: HandshakeIcon,
    title: 'Community Building',
    description: 'Creating welcoming spaces for meaningful member connections.',
    size: 'sm',
  },
  {
    id: 3,
    Icon: PenIcon,
    title: 'Content Creation',
    description:
      'Developing engaging chess and entertainment content across platforms.',
    size: 'sm',
  },
];

const Skills = () => (
  <Section className='relative w-full pt-10'>
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-2 px-6'>
        <h2 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          My Expertise
        </h2>
        <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
          I have specialized skills in building and moderating engaging online
          spaces
        </p>
      </div>

      <div className='w-full space-y-4 border-border border-t border-dashed pb-4'>
        <div className='grid grid-cols-1 divide-x divide-y divide-dashed divide-border text-left sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <ViewAnimation
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              // Make the delay the length of the grid for example if there are 3 items in one row then it is modulo 3 or 2 items in one row then it is modulo 2
              // so that the animation is staggered
              // this is checked as size if lg it takes to cols and if sm it takes 1 col
              delay={(index % (feature.size === 'lg' ? 2 : 3)) * 0.15}
              className={featureItemVariants({
                size: feature.size as 'sm' | 'lg',
              })}
              key={feature.id}
            >
              <feature.Icon className='h-8 w-8 stroke-1 transition-transform hover:rotate-12 hover:scale-125' />
              <div className='flex flex-col '>
                <h3 className='text-xl tracking-tight transition-all'>
                  {feature.title}
                </h3>
                <p className='max-w-xs text-base text-muted-foreground transition-all'>
                  {feature.description}
                </p>
              </div>
            </ViewAnimation>
          ))}
        </div>
        <div className='flex flex-row gap-4 px-6 py-4'>
          <Badge>
            <span className='font-semibold text-sm'>Chess</span>
          </Badge>
          <Badge>
            <span className='font-semibold text-sm'>Community</span>
          </Badge>
          {/* carousel of languages adn technologies u know */}
        </div>
      </div>
    </div>
  </Section>
);
export default Skills;
