import { getGuestbookEntries } from '@/server/db/queries/guestbook'
import { url } from '@/lib/url';

const formatGuestbookEntries = (
  entries: Awaited<ReturnType<typeof getGuestbookEntries>>
) => {
  if (entries.length === 0) {
    return 'No guestbook entries yet.'
  }

  return entries
    .slice(0, 15)
    .map((entry) => {
      const date = new Date(entry.createdAt).toISOString()
      return `- ${entry.name} (${date}): ${entry.message}`
    })
    .join('\n')
}

export async function getGuestbookText() {
  const entries = await getGuestbookEntries(null)

  return `# Guestbook
Route: ${url('/guestbook')}

## Recent Entries

${formatGuestbookEntries(entries)}`
}
