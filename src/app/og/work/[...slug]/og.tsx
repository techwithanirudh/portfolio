import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactElement } from 'react'

interface GenerateProps {
  title: string
  description?: string
  backgroundImage?: string | null
}

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    format: 'webp',
    width: 1200,
    height: 630,
  }
}

export function generate({
  title,
  description = 'Learn more about this work by visiting the website.',
  backgroundImage,
}: GenerateProps): ReactElement {
  const primaryColor = '#3b82f6'
  const backgroundStyle = backgroundImage
    ? `linear-gradient(135deg, rgba(17,17,17,0.9) 0%, rgba(0,0,0,0.7) 70%), url(${backgroundImage})`
    : `linear-gradient(to bottom right, ${primaryColor}, transparent)`

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#050505',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'white',
        backgroundImage: backgroundStyle,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '60px',
          position: 'relative',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Selected Work
          </span>
          <span
            style={{
              fontSize: title.length > 24 ? 64 : 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              textShadow: '0 6px 20px rgba(0,0,0,0.45)',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 38,
              color: '#d4d4d8',
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: '92%',
              letterSpacing: '-0.01em',
            }}
          >
            {description}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              height: 4,
              width: 64,
              backgroundColor: primaryColor,
              borderRadius: 999,
            }}
          />
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Case Study
          </span>
        </div>
      </div>
    </div>
  )
}
