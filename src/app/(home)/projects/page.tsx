import Hero from '@/app/(home)/_components/hero';
import Testimonials from '../_components/testimonials';
import { Roles } from './_components/roles';

const rolesData = [
  {
    _title: 'Tech Startup Inc.',
    _slug: 'tech-startup',
    description:
      'Led the development of a scalable web application serving over 100k users.',
    endYear: 2024,
    startYear: 2022,
    role: 'Senior Frontend Developer',
    url: 'https://techstartup.com',
    location: 'San Francisco, CA',
    type: 'Full-time',
    logo: {
      width: 100,
      height: 100,
      url: '/images/logos/light/logo-1.png',
      alt: 'Tech Startup Logo',
    },
  },
  {
    _title: 'Digital Agency Co.',
    _slug: 'digital-agency',
    description:
      'Built responsive websites and e-commerce solutions for diverse clients.',
    startYear: 2020,
    role: 'Frontend Developer',
    url: 'https://digitalagency.com',
    location: 'Remote',
    type: 'Contract',
    logo: {
      width: 100,
      height: 100,
      url: '/images/logos/light/logo-2.png',
      alt: 'Digital Agency Logo',
    },
  },
];

const testimonialsData = [
  {
    title: 'Exceptional work quality',
    description:
      'The project was delivered on time with exceptional attention to detail. Highly recommended for any development work.',
    author: {
      name: 'Sarah Johnson',
      image: 'https://github.com/sarahjohnson.png',
    },
  },
  {
    title: 'Great collaboration',
    description:
      'Working together was seamless. Great communication and technical expertise throughout the project.',
    author: {
      name: 'Mike Chen',
      image: 'https://github.com/mikechen.png',
    },
  },
];

const Work = () => {
  return (
    <>
      <Hero />
      <Roles roles={rolesData} />
      <Testimonials testimonials={testimonialsData} />
    </>
  );
};

export default Work;
