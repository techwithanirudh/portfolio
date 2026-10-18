// TODO(slopradar): unused export: nothing imports ExperiencePositionItemType (only ExperienceItemType uses it), make it module-private
export interface ExperiencePositionItemType {
  description?: string
  employmentPeriod: {
    start: string
    end?: string
  }
  employmentType?: string
  id: string
  skills?: string[]
  title: string
}

export interface ExperienceItemType {
  companyLogo?: string
  companyName: string
  companyWebsite?: string
  id: string
  isCurrentEmployer?: boolean
  positions: ExperiencePositionItemType[]
}
