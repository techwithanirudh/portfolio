import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
// Math only renders inside MDX, so its styles and 20 font faces load with it
// rather than blocking every page
import 'katex/dist/katex.css'
import { VideoPlayer } from '@/components/ui/video-player'
import { FramedImage, type FramedImageProps, IframeEmbed } from './embed'
import { GithubRepo } from './github-repo'
import { Heading } from './heading'
import { LinkPreviewAnchor } from './link-preview'
import { Mermaid } from './mermaid'

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,
  Accordion,
  Accordions,
  a: LinkPreviewAnchor,
  Callout,
  Card,
  Cards,
  File,
  Files,
  Folder,
  FramedImage,
  GithubRepo,
  h1: (props) => <Heading as='h1' {...props} />,
  h2: (props) => <Heading as='h2' {...props} />,
  h3: (props) => <Heading as='h3' {...props} />,
  h4: (props) => <Heading as='h4' {...props} />,
  h5: (props) => <Heading as='h5' {...props} />,
  h6: (props) => <Heading as='h6' {...props} />,
  IframeEmbed,
  ImageZoom,
  // MDX types `img` as a plain <img>, but fumadocs' remark-image passes
  // next/image props (a static import or a sized URL)
  img: (props) => <FramedImage {...(props as FramedImageProps)} />,
  Mermaid,
  Step,
  Steps,
  Tab,
  Tabs,
  VideoPlayer,
}
