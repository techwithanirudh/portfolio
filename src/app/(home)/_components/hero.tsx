import { baseOptions, linkItems } from '@/app/layout.config';
import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLinks } from 'fumadocs-ui/layouts/shared';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import heroImage from '../../../../public/images/gradient-noise-purple-azure-light.png';
import { ViewAnimation } from '@/components/view-animation';

const Hero = () => {
  const links = getLinks(linkItems, baseOptions.githubUrl);
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all'),
  );

  return (
    <Section className='relative flex flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:py-32'>
      <motion.div
        initial={{ opacity: 0, translateY: -8  }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          duration: 0.4,
          scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
        }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className='-z-10 absolute inset-0 h-full w-full'
      >
        <Image
          src={heroImage}
          alt='Hero Background'
          height={600}
          width={704}
          className='pointer-events-none absolute right-0 bottom-0 h-[900px] w-[1004px] max-w-[1004px] translate-x-1/2 translate-y-1/2 select-none opacity-80 dark:opacity-100'
          priority
        />
      </motion.div>
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
          )}
        >
          Hi! I'm Kyle!
        </h1>
      </ViewAnimation>
      <ViewAnimation
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        delay={0.8}
      >
        <p className='max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl'>
          <Balancer>
            I’m passionate about Discourse forums and experienced in community
            moderation. I enjoy reading my favorite book series, Wings of Fire.
          </Balancer>
        </p>
      </ViewAnimation>

      <div className='flex flex-wrap items-center justify-center gap-4'>
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={1.2}
        >
          <Link
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg',
              }),
              'group rounded-full bg-primary hover:bg-primary/90',
            )}
            href='/blog'
          >
            Browse Posts
            <Icons.arrowRight className='group-hover:-rotate-45 ml-2 size-5 transition-transform' />
          </Link>
        </ViewAnimation>

        <div className='flex items-center space-x-4'>
          {navItems
            .filter((item) => item.type === 'icon')
            .map((item, i) => (
              <ViewAnimation
                initial={{ opacity: 0, translateY: -8 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                delay={1.6 + i * 0.4}
                key={i.toString()}
                className='flex items-center'
              >
                <Link
                  href={item.url}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
                    }),
                    'rounded-full',
                  )}
                >
                  {item.icon}
                  <span className='sr-only'>{item.text}</span>
                </Link>
              </ViewAnimation>
            ))}
        </div>
      </div>
    </Section>
  );
};

export default Hero;
