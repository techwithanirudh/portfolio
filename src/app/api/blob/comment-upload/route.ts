import { handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const result = await handleUpload({
    request,
    body,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith('comments/')) {
        throw new Error('Invalid upload path.')
      }

      return {
        allowedContentTypes: [
          'image/png',
          'image/jpeg',
          'image/webp',
          'image/gif',
        ],
        maximumSizeInBytes: 5 * 1024 * 1024,
        addRandomSuffix: true,
        cacheControlMaxAge: 31_536_000,
      }
    },
  })

  return NextResponse.json(result)
}
