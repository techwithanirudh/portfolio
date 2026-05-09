import type React from 'react'

export interface ExperiencePositionItemType {
  description?: string
  employmentPeriod: {
    start: string
    end?: string
  }
  employmentType?: string
  icon?: React.ReactElement
  id: string
  isExpanded?: boolean
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

export interface WorkExperienceProps {
  className?: string
  experiences: ExperienceItemType[]
}

export interface ExperienceItemProps {
  experience: ExperienceItemType
}

export interface ExperiencePositionItemProps {
  position: ExperiencePositionItemType
}
