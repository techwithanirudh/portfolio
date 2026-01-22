import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactElement } from 'react'

interface GenerateProps {
  title?: string
  subtitle?: string
}

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    format: 'png',
    width: 1200,
    height: 630,
  }
}

export function generate({
  title = 'John Doe',
  subtitle,
}: GenerateProps): ReactElement {
  const hasSubtitle = Boolean(subtitle)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Geist, ui-sans-serif, system-ui',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 64,
          width: 1,
          borderLeft: '1px dashed #1c1917',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 64,
          width: 1,
          borderLeft: '1px dashed #1c1917',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#1c1917',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#1c1917',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 64,
          right: 64,
          bottom: 64,
          left: 64,
          width: 896,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textWrap: 'balance',
            fontWeight: 600,
            fontSize: title.length > 20 ? 64 : 80,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: hasSubtitle ? 24 : 0,
          }}
        >
          <span>{title}</span>
          {hasSubtitle ? (
            <span
              style={{
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: '#d4d4d8',
                maxWidth: 760,
              }}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
