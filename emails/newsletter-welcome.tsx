import { Heading, Img, Link, Section, Text } from '@react-email/components'
import { title as siteTitle } from '@/constants/site'
import type { BlogPage } from '@/lib/source'
import { url as siteUrl } from '@/lib/url'
import { ArrowButton, Block, EmailShell } from './components'
import { colors, contentWidth, fonts, radius, styles } from './theme'

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
    <Block>
      <Link href={url}>
        <Img
          alt={title}
          className='em-card'
          src={image ?? siteUrl('/images/placeholder.png')}
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: radius.card,
            height: 'auto',
            width: '100%',
          }}
          width={contentWidth}
        />
      </Link>
      <Text style={{ margin: '20px 0 4px' }}>
        <Link
          className='em-fg'
          href={url}
          style={{
            color: colors.foreground,
            fontSize: '20px',
            fontWeight: 500,
            letterSpacing: '-0.4px',
            lineHeight: '28px',
            textDecoration: 'none',
          }}
        >
          {title}
        </Link>
      </Text>
      {description ? (
        <Text
          className='em-muted'
          style={{ ...styles.muted, fontSize: '15px' }}
        >
          {description}
        </Text>
      ) : null}
      <Text style={{ margin: '12px 0 0' }}>
        <Link
          className='em-link'
          href={url}
          style={{ ...styles.link, fontSize: '14px', fontWeight: 500 }}
        >
          Read post
        </Link>
      </Text>
    </Block>
  )
}

export default function NewsletterWelcomeEmail({
  firstName,
  posts,
}: NewsletterWelcomeEmailProps) {
  const host = new URL(siteUrl('/')).host

  return (
    <EmailShell
      label='Newsletter'
      preview="You're subscribed. Here's what I've written so far."
    >
      <Block>
        <Heading className='em-fg' style={styles.heading}>
          Welcome
          <span className='em-link' style={{ color: colors.primary }}>
            .
          </span>
        </Heading>
        <Text className='em-fg' style={{ ...styles.text, marginTop: '20px' }}>
          Hey {firstName},
        </Text>
        <Text className='em-fg' style={styles.text}>
          Thanks for subscribing. Expect an email every few weeks, and now and
          then something that only goes out to the newsletter.
        </Text>
        <Text
          className='em-fg'
          style={{ ...styles.text, marginBottom: '24px' }}
        >
          Here&apos;s what I&apos;ve written so far, newest first.
        </Text>
        <ArrowButton href={siteUrl('/blog')}>Read the blog</ArrowButton>
      </Block>

      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.url} {...post} />)
      ) : (
        <Block>
          <Text className='em-muted' style={styles.muted}>
            No posts yet. The first one is on its way.
          </Text>
        </Block>
      )}

      <Block>
        <Text className='em-fg' style={{ ...styles.text, margin: 0 }}>
          Thanks for reading,
        </Text>
        <Text
          className='em-fg'
          style={{
            color: colors.foreground,
            fontFamily: fonts.hand,
            fontSize: '30px',
            lineHeight: '36px',
            margin: '4px 0 0',
          }}
        >
          {siteTitle}
        </Text>
      </Block>

      <Section className='em-divided' style={styles.sectionDivided}>
        <Text
          className='em-muted'
          style={{ ...styles.muted, fontSize: '13px' }}
        >
          You&apos;re getting this because you subscribed on{' '}
          <Link className='em-link' href={siteUrl('/')} style={styles.link}>
            {host}
          </Link>
          .
        </Text>
      </Section>
    </EmailShell>
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
