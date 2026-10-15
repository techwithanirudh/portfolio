import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { profile } from '../_shared/profile'
import { Canvas } from './_components/canvas'
import { LayersTree } from './_components/layers-panel'
import { MeasureOverlay } from './_components/measure'
import { PropertiesPanel } from './_components/properties-panel'
import { LeftRuler, TopRuler } from './_components/rulers'
import { SelectionDock } from './_components/selection-dock'
import { TitleBar } from './_components/title-bar'
import { Toolbar } from './_components/toolbar'
import { Workspace } from './_components/workspace'
import './variant.css'

export const metadata: Metadata = {
  title: {
    default: 'Artboard',
    template: '%s · Artboard',
  },
}

export default function ArtboardLayout({ children }: { children: ReactNode }) {
  return (
    <Workspace>
      <a
        className='ab-btn ab-btn-primary fixed top-2 left-2 z-50 -translate-y-20 focus:translate-y-0'
        href='#canvas'
      >
        Skip to canvas
      </a>
      <TitleBar
        avatar={profile.avatar}
        email={profile.email}
        name={profile.name}
      />
      <div className='grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_260px]'>
        <aside
          aria-label='Layers panel'
          className='ab-panel hidden border-(--panel-line) border-r lg:block'
        >
          <div className='ab-panel-inner pb-24'>
            <div className='ab-panel-section flex items-center justify-between py-2.5'>
              <h2 className='font-semibold text-[11px] leading-7'>Layers</h2>
              <span className='ab-t-label text-(--faint)'>3 pages</span>
            </div>
            <LayersTree />
          </div>
        </aside>
        <div className='min-w-0'>
          <TopRuler />
          <div className='md:grid md:grid-cols-[var(--ruler-size)_minmax(0,1fr)]'>
            <LeftRuler />
            <Canvas>{children}</Canvas>
          </div>
        </div>
        <aside
          aria-label='Properties panel'
          className='ab-panel hidden border-(--panel-line) border-l xl:block'
        >
          <div className='ab-panel-inner'>
            <PropertiesPanel />
          </div>
        </aside>
      </div>
      <Toolbar />
      <SelectionDock />
      <MeasureOverlay />
    </Workspace>
  )
}
