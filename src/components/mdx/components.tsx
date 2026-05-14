import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { Heading } from '@/components/prose'
import { VideoPlayer } from '../ui/video-player'
import { FramedImage, IframeEmbed } from './embed'
import { GitHubRepo, GithubRepo } from './github-repo'
import { LinkPreviewAnchor } from './link-preview'
import { Mermaid } from './mermaid'

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,
  h1: (props) => <Heading as='h1' {...props} />,
  h2: (props) => <Heading as='h2' {...props} />,
  h3: (props) => <Heading as='h3' {...props} />,
  h4: (props) => <Heading as='h4' {...props} />,
  h5: (props) => <Heading as='h5' {...props} />,
  h6: (props) => <Heading as='h6' {...props} />,
  a: LinkPreviewAnchor,
  Accordion,
  Accordions,
  Callout,
  Card,
  Cards,
  File,
  Files,
  Folder,
  FramedImage,
  GitHubRepo,
  GithubRepo,
  IframeEmbed,
  ImageZoom,
  img: FramedImage,
  Mermaid,
  Step,
  Steps,
  Tab,
  Tabs,
  VideoPlayer,
}
