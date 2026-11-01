import { Heading, Link, Section, Text } from '@react-email/components'
import { url } from '@/lib/url'
import { ArrowButton, Block, EmailShell } from './components'
import { styles } from './theme'

interface ContactNotificationEmailProps {
  email: string
  message: string
  name: string
  sentAt: string
}

export default function ContactNotificationEmail({
  email,
  message,
  name,
  sentAt,
}: ContactNotificationEmailProps) {
  return (
    <EmailShell label='Contact form' preview={message}>
      <Block>
        <Heading
          className='em-fg'
          style={{
            ...styles.heading,
            fontSize: '28px',
            letterSpacing: '-1.2px',
            lineHeight: '34px',
          }}
        >
          {name}
        </Heading>
        <Text
          className='em-muted'
          style={{ ...styles.muted, marginTop: '6px' }}
        >
          <Link
            className='em-link'
            href={`mailto:${email}`}
            style={styles.link}
          >
            {email}
          </Link>{' '}
          · {sentAt}
        </Text>
      </Block>

      <Block>
        <Section className='em-card' style={styles.card}>
          <Text
            className='em-fg'
            style={{ ...styles.text, margin: 0, whiteSpace: 'pre-wrap' }}
          >
            {message}
          </Text>
        </Section>
        <Section style={{ marginTop: '24px' }}>
          <ArrowButton href={`mailto:${email}`}>Reply to {name}</ArrowButton>
        </Section>
      </Block>

      <Block>
        <Text
          className='em-muted'
          style={{ ...styles.muted, fontSize: '13px' }}
        >
          Sent from the{' '}
          <Link className='em-link' href={url('/contact')} style={styles.link}>
            contact form
          </Link>{' '}
          on your site.
        </Text>
      </Block>
    </EmailShell>
  )
}

ContactNotificationEmail.PreviewProps = {
  email: 'sam@example.com',
  message:
    'sup! love the dog, cool website!\n\nalso where did you get that hero gradient, been looking for something like it for my own site',
  name: 'Sam',
  sentAt: 'Oct 18, 2026, 2:11 AM IST',
} satisfies ContactNotificationEmailProps
