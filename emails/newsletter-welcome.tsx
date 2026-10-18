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
import { title as siteTitle } from '@/constants/site'
import type { BlogPage } from '@/lib/source'
import { url as siteUrl } from '@/lib/url'

interface NewsletterWelcomeEmailProps {
  firstName: string
  posts: (Pick<BlogPage['data'], 'title' | 'description' | 'image'> & {
    url: string
  })[]
}

function PostCard({
  title,
  description,
  image,
  url,
}: NewsletterWelcomeEmailProps['posts'][number]) {
  return (
    <Section className='my-[16px]'>
      <Link href={url}>
        <Img
          alt={title}
          className='w-full rounded-[12px] object-cover'
          height='320'
          src={image ?? siteUrl('/images/placeholder.png')}
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
        {/* TODO(slopradar): duplication: versioned gstatic Font blocks repeat across both templates (x3) with different families, move them to the shared emails/theme.ts noted in contact-notification.tsx */}
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
                <span className='font-bold tracking-tighter'>{siteTitle}</span>
              </Text>
              <Heading className='my-4 font-medium text-4xl leading-tight'>
                Welcome!
              </Heading>
              <Text className='text-lg leading-8'>Hey {firstName},</Text>
              <Text className='text-lg leading-8'>
                Thanks for subscribing to my newsletter! You can expect an email
                every few weeks. I might also send newsletter-only content now
                and then.
              </Text>
              <Text className='text-lg leading-8'>
                Here&apos;s what I&apos;ve written so far, newest first:
              </Text>
            </Section>

            <Hr className='my-4' />

            <Section className='my-[16px]'>
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.url} {...post} />)
              ) : (
                <Text className='text-[16px] text-zinc-500 leading-[24px]'>
                  No posts yet. The first one is on its way.
                </Text>
              )}
            </Section>

            <Hr className='my-4' />

            <Section>
              <Text className='text-lg text-zinc-900 leading-8'>
                Thanks for reading!
              </Text>
              <Text
                className='select-none text-4xl text-zinc-900 leading-8'
                style={{ fontFamily: 'Alex Brush' }}
              >
                {siteTitle}
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
      description: 'An introduction, and what I plan to write about here.',
      image: siteUrl('/images/blog/first-post.png'),
      title: 'Hello world',
      url: siteUrl('/blog/hello-world'),
    },
    {
      description:
        'Teaching a Slack bot to run code safely, by way of Vercel Sandboxes, E2B, and finally Daytona.',
      image: siteUrl('/images/blog/gorkie-sandboxes.jpg'),
      title: 'How we taught a Slack bot to run code',
      url: siteUrl('/blog/gorkie-sandboxes'),
    },
    {
      description:
        'A custom UI-styled VS Code setup, with links to my real config.',
      image: siteUrl('/images/blog/vscode-setup.jpg'),
      title: 'my VSCode setup',
      url: siteUrl('/blog/vscode-setup'),
    },
  ],
} satisfies NewsletterWelcomeEmailProps
