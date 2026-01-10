import { cn } from '@/lib/utils';
import { Children, type ReactNode } from 'react';
import { Balancer } from 'react-wrap-balancer';
import { ViewAnimation } from '@/components/view-animation';
import { Section } from '../section';
import { cva, type VariantProps } from 'class-variance-authority';

const heroVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default:
        'gap-8 py-8 sm:rounded-lg sm:border sm:bg-background sm:px-8 sm:py-20 sm:shadow-sm',
      compact: 'gap-4 lg:p-2',
    },
    align: {
      center: 'items-start justify-center sm:items-center',
      start: 'items-start justify-center sm:items-start',
      end: 'items-start justify-center sm:items-end',
    },
  },
  defaultVariants: {
    variant: 'default',
    align: 'center',
  },
});

type HeroProps = {
  image?: ReactNode;
  caption?: string | ReactNode | null;
  title: string | ReactNode;
  description?: string | ReactNode | null;
  children?: ReactNode;
  className?: string;
};

export const HeroSection = ({
  image,
  caption,
  title,
  description,
  children,
  className,
  variant,
  align,
}: HeroProps &
  VariantProps<typeof heroVariants> & {
    asChild?: boolean;
  }) => (
  <Section className='p-4'>
    <div className={cn(heroVariants({ variant, align, className }))}>
      {image && (
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          {image}
        </ViewAnimation>
      )}
      <div className='flex flex-col gap-4 sm:items-center'>
        {caption && (
          <ViewAnimation
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <small className='block text-muted-foreground text-sm sm:text-base'>
              <Balancer>{caption}</Balancer>
            </small>
          </ViewAnimation>
        )}
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.4}
        >
          <h1
            className={cn(
              'max-w-4xl font-bold text-3xl leading-tight tracking-tight',
              'sm:text-center sm:text-4xl sm:leading-tight',
              'md:text-5xl md:leading-tight',
              variant === 'compact' && 'font-normal text-left sm:text-left font-regular tracking-tighter',
            )}
          >
            <Balancer>{title}</Balancer>
          </h1>
        </ViewAnimation>
        {description && (
          <ViewAnimation
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.6}
          >
            <p className={cn(
              'text-muted-foreground text-sm sm:text-base',
              variant === 'compact' && 'max-w-xl text-left text-lg leading-relaxed tracking-tight lg:max-w-lg'
            )}>
              <Balancer>{description}</Balancer>
            </p>
          </ViewAnimation>
        )}
      </div>
      {Children.map(children, (child, index) => (
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={description ? 1 : 0.8 + index * 0.2}
        >
          {child}
        </ViewAnimation>
      ))}
    </div>
  </Section>
);
