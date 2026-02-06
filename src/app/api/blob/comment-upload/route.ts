import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
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
      onUploadCompleted: async () => {
        // Optional: hook for persistence or analytics.
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    )
  }
}
