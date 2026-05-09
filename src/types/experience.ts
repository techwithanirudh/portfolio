import type React from 'react'

export type ExperiencePositionItemType = {
  id: string
  title: string
  employmentPeriod: {
    start: string
    end?: string
  }
  employmentType?: string
  description?: string
  icon?: React.ReactElement
  skills?: string[]
  isExpanded?: boolean
}

export type ExperienceItemType = {
  id: string
  companyName: string
  companyLogo?: string
  companyWebsite?: string
  positions: ExperiencePositionItemType[]
  isCurrentEmployer?: boolean
}

export type WorkExperienceProps = {
  className?: string
  experiences: ExperienceItemType[]
}

export type ExperienceItemProps = {
  experience: ExperienceItemType
}

export type ExperiencePositionItemProps = {
  position: ExperiencePositionItemType
}
