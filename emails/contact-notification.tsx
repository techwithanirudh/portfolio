import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { baseUrl } from '@/constants'
import { handle } from '@/constants/site'

interface ContactNotificationEmailProps {
  email: string
  message: string
  name: string
  sentAt: string
}

const primary = '#3451b2'

// Kept plain on purpose: it reads like a note, and the mail app's own Reply
// already goes to the visitor through replyTo
export default function ContactNotificationEmail({
  email,
  message,
  name,
  sentAt,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily='Helvetica'
          fontFamily='Geist'
          fontStyle='normal'
          fontWeight={400}
          webFont={{
            format: 'woff2',
            url: 'https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFWNOITd.woff2',
          }}
        />
      </Head>
      <Preview>{message.slice(0, 120)}</Preview>
      <Tailwind>
        <Body className='m-0 bg-white py-8 font-sans'>
          <Container className='mx-auto w-full max-w-[520px] px-6'>
            <Heading className='m-0 font-semibold text-[#0a0a0a] text-[20px] tracking-tight'>
              {name}
            </Heading>
            <Text className='mt-0.5 mb-0 text-[#737373] text-[14px]'>
              <Link href={`mailto:${email}`} style={{ color: primary }}>
                {email}
              </Link>{' '}
              · {sentAt}
            </Text>

            <Hr className='my-5 border-[#e5e5e5]' />

            <Section
              className='pl-4'
              style={{ borderLeft: `2px solid ${primary}` }}
            >
              {/* Keeps the visitor's own line breaks */}
              <Text className='m-0 whitespace-pre-wrap text-[#0a0a0a] text-[16px] leading-[26px]'>
                {message}
              </Text>
            </Section>

            <Text className='mt-8 mb-0 text-[13px]'>
              <Link href={`${baseUrl}/contact`} style={{ color: '#737373' }}>
                {handle}
                <span style={{ color: primary }}>.</span>
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ContactNotificationEmail.PreviewProps = {
  email: 'luiggi@example.com',
  message:
    'sup! love the dog, cool website!\n\nalso where did you get that hero gradient, been looking for something like it for my own site',
  name: 'luiggi',
  sentAt: 'Oct 18, 2026, 2:11 AM IST',
} satisfies ContactNotificationEmailProps
