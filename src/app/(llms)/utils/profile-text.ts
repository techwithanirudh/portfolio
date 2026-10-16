import { getAboutText } from './about'
import { getColophonText } from './colophon'
import { getContactText } from './contact'
import { getExperienceText } from './experience'
import { getCommitHistoryText } from './github-commits'
import { getSkillsText } from './skills'
import { getTestimonialsText } from './testimonials'
import { getUsesText } from './uses'

export async function getProfileText() {
  const commitHistory = await getCommitHistoryText()

  return [
    getAboutText(),
    commitHistory,
    getExperienceText(),
    getSkillsText(),
    getTestimonialsText(),
    getUsesText(),
    getColophonText(),
    getContactText(),
  ]
    .filter(Boolean)
    .join('\n')
}
