import {
  getContentIndexText,
  getSiteMapText,
  getSiteText,
} from '@/app/(llms)/utils'
import { description, title } from '@/constants/site'

export async function getAssistantContext() {
  return `# ${title}
> ${description}

${await getSiteText()}
${getSiteMapText()}
${getContentIndexText({ blog: (item) => item.url, work: (item) => item.url })}`
}
