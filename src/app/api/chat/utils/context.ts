import { getContentIndexText } from '@/app/(llms)/utils/content-index'
import { getSiteMapText } from '@/app/(llms)/utils/site-pages'
import { getSiteText } from '@/app/(llms)/utils/site-text'
import { description, title } from '@/constants/site'

export async function getAssistantContext() {
  return `# ${title}
> ${description}

${await getSiteText()}
${getSiteMapText()}
${getContentIndexText({ blog: (item) => item.url, projects: (item) => item.url })}`
}
