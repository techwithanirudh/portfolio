// A project card and its case study header share these view transition names, so
// the cover, title and description morph between them on a `project-card` visit
export const projectTransitionShare = {
  default: 'none',
  'project-card': 'via-blur',
} as const

export const projectTransitionName = (
  slug: string,
  part: 'description' | 'image' | 'title'
) => `${slug}-${part}`
