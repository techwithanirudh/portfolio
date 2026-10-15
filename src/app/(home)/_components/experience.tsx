import { WorkExperience } from '@/components/features/work'
import {
  Panel,
  PanelButton,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/layout/panel'
import { experiences } from '@/constants/portfolio/experiences'

const previewCount = 3

export default function ExperiencePreview() {
  return (
    <Panel id='experience'>
      <PanelHeader>
        <PanelTitle>
          Experience
          <PanelTitleSup>({experiences.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>
      <WorkExperience experiences={experiences.slice(0, previewCount)} />
      <PanelButton href='/about#experience'>View all experience</PanelButton>
    </Panel>
  )
}
