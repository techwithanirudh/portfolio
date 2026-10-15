import { MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Icons } from '@/components/icons/icons'
import {
  experiences,
  getWork,
  getWriting,
  profile,
  testimonials,
} from '../_shared/profile'
import { Artboard } from './_components/artboard'
import { AskSimba } from './_components/ask-simba'
import { ExperienceRow, PostRow, ProjectCard } from './_components/cards'
import { contactInfo, simbaInfo, testimonialInfo } from './_components/data'
import { Hero } from './_components/hero'
import { BASE } from './_components/nav'
import { BoardHeader } from './_components/sections'
import { Selectable } from './_components/selectable'
import { SimbaLayer } from './_components/simba'

export const metadata: Metadata = {
  description: profile.description,
  title: 'Home',
}

const socialIcon = {
  GitHub: Icons.github,
  LinkedIn: Icons.linkedin,
  X: Icons.x,
  YouTube: Icons.youtube,
} as const

export default function ArtboardHome() {
  const work = getWork()
  const selected = work.slice(0, 4)
  const posts = getWriting().slice(0, 3)
  const roles = experiences
    .filter((company) => company.id !== 'personal')
    .slice(0, 3)
  const [quote] = testimonials

  return (
    <>
      <Artboard id='hero' name='Hero' page='Home'>
        <Hero />
      </Artboard>

      <Artboard id='selected-work' name='Selected work' page='Home'>
        <div className='p-6 sm:p-10'>
          <BoardHeader
            action={{
              href: `${BASE}/work`,
              label: `All ${work.length} projects`,
            }}
            count={`${selected.length}/${work.length}`}
            description='Pinned projects first: templates, agents, apps and tools I maintain.'
            title='Selected work'
          />
          <div className='mt-8 grid gap-5 sm:grid-cols-2'>
            {selected.map((item, i) => (
              <ProjectCard item={item} key={item.slug} priority={i < 2} />
            ))}
          </div>
        </div>
      </Artboard>

      <Artboard id='experience' name='Experience' page='Home'>
        <div className='p-6 sm:p-10'>
          <BoardHeader
            action={{ href: `${BASE}/about#experience`, label: 'Full history' }}
            description='Where I have worked, newest first.'
            title='Experience'
          />
          <div className='ab-rule mt-6 divide-y divide-(--board-line) border-y'>
            {roles.flatMap((company) =>
              company.positions
                .slice(0, 1)
                .map((position) => (
                  <ExperienceRow
                    company={company}
                    key={company.id}
                    position={position}
                  />
                ))
            )}
          </div>
        </div>
      </Artboard>

      <Artboard id='writing' name='Writing' page='Home'>
        <div className='p-6 sm:p-10'>
          <BoardHeader
            action={{ href: '/blog', label: 'All posts' }}
            title='Writing'
          />
          <div className='ab-rule mt-6 divide-y divide-(--board-line) border-y'>
            {posts.map((post) => (
              <PostRow key={post.url} post={post} />
            ))}
          </div>
        </div>
      </Artboard>

      {quote ? (
        <Artboard id='kind-words' name='Kind words' page='Home'>
          <div className='p-6 sm:p-10'>
            <Selectable
              info={testimonialInfo(quote)}
              layer={`Quote / ${quote.author.name}`}
            >
              <figure className='grid gap-6 md:grid-cols-[48px_minmax(0,1fr)]'>
                <span
                  aria-hidden
                  className='font-semibold text-(--sel) text-[56px] leading-[0.8]'
                  data-outline-text
                >
                  “
                </span>
                <div>
                  <p className='ab-t-label text-(--muted)'>{quote.title}</p>
                  <blockquote
                    className='mt-3 font-medium text-[20px] leading-[1.45] tracking-[-0.01em] sm:text-[22px]'
                    data-layer='quote'
                    data-layer-type='text'
                  >
                    {quote.description}
                  </blockquote>
                  <figcaption className='mt-6 flex items-center gap-3'>
                    <span className='relative size-9 overflow-hidden rounded-full'>
                      <Image
                        alt=''
                        className='object-cover'
                        fill
                        sizes='36px'
                        src={quote.author.image}
                      />
                    </span>
                    <span className='text-[13px] leading-5'>
                      <span className='block font-semibold'>
                        {quote.author.name}
                      </span>
                      <span className='ab-t-label text-(--muted)'>
                        Testimonial 1 of {testimonials.length}
                      </span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            </Selectable>
          </div>
        </Artboard>
      ) : null}

      <Artboard hiddenLayers={1} id='contact' name='Contact' page='Home'>
        <div className='grid gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end'>
          <Selectable info={contactInfo} layer='Contact / Details'>
            <div>
              <BoardHeader
                description='Hiring, collaborating or just saying hi? Email me, or find me on any of these.'
                title='Contact'
              />
              <a
                className='ab-t-title ab-link mt-6 inline-block break-all'
                data-layer='email'
                data-layer-type='text'
                data-outline-text
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
              <ul className='mt-6 flex flex-wrap gap-2'>
                {profile.socials
                  .filter((s) => s.name in socialIcon)
                  .map((s) => {
                    const Icon = socialIcon[s.name as keyof typeof socialIcon]
                    return (
                      <li key={s.name}>
                        <a
                          className='ab-btn ab-btn-ghost'
                          href={s.url}
                          rel='noopener'
                          target='_blank'
                        >
                          <Icon aria-hidden className='size-3.5' />
                          {s.name}
                        </a>
                      </li>
                    )
                  })}
                <li>
                  <AskSimba className='ab-btn ab-btn-ghost'>
                    <MessageCircle aria-hidden className='size-3.5' />
                    Ask Simba
                  </AskSimba>
                </li>
              </ul>
            </div>
          </Selectable>
          <SimbaLayer info={simbaInfo} />
        </div>
      </Artboard>
    </>
  )
}
