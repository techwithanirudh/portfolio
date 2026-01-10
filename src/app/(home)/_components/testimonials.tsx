'use client';

import { Section } from '@/components/section';
import { SectionHeader } from '@/components/sections/section-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ViewAnimation } from '@/components/view-animation';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Testimonial {
  title: string;
  description: string;
  author: {
    name: string;
    image: string;
  };
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);
  }, [api, current]);

  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          title="What others are saying"
          description="I've had the pleasure of working with some amazing people. Here is what they have to say about my work."
          align="left"
          className="px-6"
        />

        <ViewAnimation
          initial={{ opacity: 0, translateY: 24 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.5}
        >
          <Carousel
            setApi={setApi}
            className='w-full border-border border-t border-dashed'
          >
          <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
            {testimonials.map((item, index) => (
              <CarouselItem
                className='pl-0 lg:basis-1/2'
                key={`${item.title}_${index}`}
              >
                <ViewAnimation
                  initial={{ opacity: 0, translateX: -20, scale: 0.95 }}
                  whileInView={{ opacity: 1, translateX: 0, scale: 1 }}
                  delay={0.7 + index * 0.15}
                  className='h-full'
                >
                  <div className='flex aspect-video flex-col justify-between p-6 transition-all duration-300 hover:bg-card hover:shadow-lg hover:scale-[1.02] lg:col-span-2'>
                    <User className='h-8 w-8 stroke-1 transition-transform hover:rotate-12 hover:scale-125' />
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <h3 className='text-xl tracking-tight'>{item.title}</h3>
                        <p className='max-w-xs text-base text-muted-foreground'>
                          {item.description}
                        </p>
                      </div>
                      <p className='flex flex-row items-center gap-2 text-sm'>
                        <span className='text-muted-foreground'>By</span>
                        <Avatar className='h-6 w-6'>
                          <AvatarImage src={item.author.image} />
                          <AvatarFallback>??</AvatarFallback>
                        </Avatar>
                        <span>{item.author.name}</span>
                      </p>
                    </div>
                  </div>
                </ViewAnimation>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        </ViewAnimation>
      </div>
    </Section>
  );
};

export default Testimonials;
