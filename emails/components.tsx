import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
} from '@react-email/components'
import type { ReactNode } from 'react'
import { brandName } from '@/constants/site'
import { url } from '@/lib/url'
import { colors, headCss, styles, webFonts } from './theme'

export function EmailShell({
  children,
  label,
  preview,
}: {
  children: ReactNode
  label: string
  preview: string
}) {
  return (
    <Html lang='en'>
      <Head>
        <meta content='light dark' name='color-scheme' />
        <meta content='light dark' name='supported-color-schemes' />
        <Font
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          fontFamily='Geist'
          fontWeight='100 900'
          webFont={{ format: 'woff2', url: webFonts.geist }}
        />
        <style>{headCss}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body className='em-body' style={styles.body}>
        <Container className='em-frame' style={styles.frame}>
          <Section style={styles.section}>
            <Row>
              <Column>
                <Wordmark />
              </Column>
              <Column align='right' className='em-muted' style={styles.label}>
                {label}
              </Column>
            </Row>
          </Section>
          {children}
        </Container>
      </Body>
    </Html>
  )
}

export function Block({ children }: { children: ReactNode }) {
  return (
    <Section className='em-divided' style={styles.sectionDivided}>
      {children}
    </Section>
  )
}

export function Wordmark() {
  return (
    <Link className='em-fg' href={url('/')} style={styles.wordmark}>
      {brandName}
      <span className='em-link' style={{ color: colors.primary }}>
        .
      </span>
    </Link>
  )
}

export function ArrowButton({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <Button className='em-button' href={href} style={styles.button}>
      {children}
      <Img
        alt=''
        className='em-arrow'
        height='16'
        src={url('/emails/arrow-right.png')}
        style={styles.buttonIcon}
        width='16'
      />
    </Button>
  )
}
