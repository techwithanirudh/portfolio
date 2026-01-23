export interface TechnologyItem {
  name: string
  description: string
  url?: string
}

export interface AttributionItem {
  name: string
  url: string
}

export interface TypographySample {
  label: string
  className: string
}

export interface TypographyContent {
  intro: string
  samples: TypographySample[]
}
