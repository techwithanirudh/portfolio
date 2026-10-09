import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { baseUrl } from '@/constants'
import { title } from '@/constants/site'

interface NewsletterWelcomeEmailProps {
  firstName: string
  posts: {
    title: string
    description?: string
    date: Date
    tags?: string[]
    image?: string
    author: string
    url: string
  }[]
}

function PostCard({
  title,
  description,
  image,
  url,
}: NewsletterWelcomeEmailProps['posts'][0]) {
  return (
    <Section className='my-[16px]'>
      <Link href={url}>
        <Img
          alt='Post image'
          className='w-full rounded-[12px] object-cover'
          height='320'
          src={image ?? `${baseUrl}/images/placeholder.png`}
        />
      </Link>
      <Section className='mt-[24px]'>
        <Link
          className='m-0 mt-[8px] font-semibold text-[32px] text-zinc-900 leading-[36px]'
          href={url}
        >
          {title}
        </Link>
        <Text className='text-[16px] text-zinc-500 leading-[24px]'>
          {description || 'Open the post to read more about this topic.'}
        </Text>
      </Section>
    </Section>
  )
}

export default function NewsletterWelcomeEmail({
  firstName,
  posts,
}: NewsletterWelcomeEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily='Georgia'
          fontFamily='Alex Brush'
          fontStyle='normal'
          fontWeight={400}
          webFont={{
            format: 'woff2',
            url: 'https://fonts.gstatic.com/s/alexbrush/v22/SZc83FzrJKuqFbwMKk6EhUXz7RlNiCY.woff2',
          }}
        />
        <Font
          fallbackFontFamily='Helvetica'
          fontFamily='Bricolage Grotesque'
          fontStyle='normal'
          fontWeight={400}
          webFont={{
            format: 'woff2',
            url: 'https://fonts.gstatic.com/s/bricolagegrotesque/v8/3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGIInHWVyNJ.woff2',
          }}
        />
      </Head>
      <Preview>Thanks for joining my newsletter!</Preview>
      <Tailwind>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto w-full max-w-[600px] p-8'>
            <Section>
              <Text className='mx-0 mt-4 mb-8 p-0 text-center font-normal text-2xl'>
                <span className='font-bold tracking-tighter'>{title}</span>
              </Text>
              <Heading className='my-4 font-medium text-4xl leading-tight'>
                Welcome!
              </Heading>
              <Text className='text-lg leading-8'>Hey {firstName},</Text>
              <Text className='text-lg leading-8'>
                Thanks for subscribing to my newsletter! I&apos;m excited to
                share my thoughts and ideas with you. You can expect an email
                every few weeks. I might also send newsletter-only content now
                and then, so stay tuned!
              </Text>
              <Text className='text-lg leading-8'>
                Here are a few popular posts from the past few months that you
                might find interesting:
              </Text>
            </Section>

            <Hr className='my-4' />

            <Section className='my-[16px]'>
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.url} {...post} />)
              ) : (
                <Text className='text-[16px] text-zinc-500 leading-[24px]'>
                  Stay tuned for upcoming content!
                </Text>
              )}
            </Section>

            <Hr className='my-4' />

            <Section>
              <Text className='text-lg text-zinc-900 leading-8'>
                Thank you for being a part of my community! I appreciate your
                support and look forward to connecting with you.
              </Text>
              <Text
                className='select-none text-4xl text-zinc-900 leading-8'
                style={{ fontFamily: 'Alex Brush' }}
              >
                {title}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

NewsletterWelcomeEmail.PreviewProps = {
  firstName: 'Jane',
  posts: [
    {
      author: 'You',
      date: new Date('2025-03-21'),
      description:
        'A look at Next.js Pages, with examples, dynamic routing, pre-rendering strategies like Static Generation and SSR, and tips for building fast, SEO-friendly web apps. Includes tricks from my latest project!',
      image: `${baseUrl}/images/blog/pages.png`,
      tags: ['Next.js', 'Pages', 'Routing'],
      title: 'Next.js Pages',
      url: `${baseUrl}/posts/pages`,
    },
    {
      author: 'You',
      date: new Date('2025-03-22'),
      description:
        'Learn to use Markdown to format blogs, docs, and notes. This post has examples, tips, and practical use cases for writing content that is easier to read, share, and maintain.',
      image: `${baseUrl}/images/blog/markdown-examples.png`,
      tags: ['Markdown', 'Docs', 'Writing'],
      title: 'Markdown Examples',
      url: `${baseUrl}/posts/markdown-examples`,
    },
    {
      author: 'You',
      date: new Date('2025-03-23'),
      description:
        'Learn MDX in Next.js to mix Markdown with React. This guide shows setup with @next/mdx, usage tips, and examples to embed JSX in posts. It works well for blogs, docs, and interactive tutorials.',
      image: `${baseUrl}/images/blog/using-mdx.png`,
      tags: ['MDX', 'Next.js', 'React'],
      title: 'Using MDX',
      url: `${baseUrl}/posts/using-mdx`,
    },
  ],
} satisfies NewsletterWelcomeEmailProps
