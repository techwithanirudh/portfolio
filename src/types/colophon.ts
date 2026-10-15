export interface TechnologyItem {
  description: string
  name: string
  url?: string
}

export interface TechnologyGroup {
  items: TechnologyItem[]
  label: string
}

export interface AttributionItem {
  name: string
  url: string
}

export interface FontSpecimen {
  className: string
  name: string
  role: string
  url: string
}

export interface TypographyItem {
  className: string
  label: string
  weight: number
}

export interface ColophonFact {
  label: string
  value: string
}

export interface DesignPrinciple {
  description: string
  title: string
}

export interface ColorToken {
  className: string
  label: string
  token: string
}
