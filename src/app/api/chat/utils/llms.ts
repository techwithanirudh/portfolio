import {
  getContentIndexText,
  getProfileText,
  getSiteMapText,
} from '@/app/(llms)/utils'
import { description, title } from '@/constants/site'

export async function getLLMsTxt() {
  return `# ${title}
> ${description}

${await getProfileText()}
${getSiteMapText()}
${getContentIndexText({ blog: (item) => item.url, work: (item) => item.url })}`
}
