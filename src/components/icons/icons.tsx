import {
  AiChat02Icon,
  Alert02Icon,
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowUp02Icon,
  ArrowUpRight01Icon,
  BrainIcon,
  Briefcase01Icon,
  Briefcase02Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkBadge02Icon,
  CheckmarkCircle01Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDotIcon,
  CodeIcon,
  Comment01Icon,
  Copy01Icon,
  CornerDownLeftIcon,
  Delete02Icon,
  DiscoverCircleIcon,
  Download01Icon,
  EraserIcon,
  File01Icon,
  File02Icon,
  GitBranchIcon,
  GitCommitHorizontalIcon,
  GitForkIcon,
  GitPullRequestIcon,
  Globe02Icon,
  Home01Icon,
  InformationCircleIcon,
  Link01Icon,
  ListChecksIcon,
  ListTreeIcon,
  Loading03Icon,
  Login03Icon,
  Logout03Icon,
  Mail01Icon,
  Menu01Icon,
  Message01Icon,
  Moon02Icon,
  MoreHorizontalCircle01Icon,
  MoreVerticalIcon,
  MultiplicationSignCircleIcon,
  Notebook01Icon,
  PawPrintIcon,
  PencilEdit01Icon,
  PlusSignIcon,
  QuoteUpIcon,
  Redo03Icon,
  RefreshCcwDotIcon,
  RefreshIcon,
  RepositoryIcon,
  RssIcon,
  Search01Icon,
  SentIcon,
  Share08Icon,
  SmartPhone01Icon,
  SourceCodeSquareIcon,
  SquareIcon,
  StarIcon,
  Sun03Icon,
  Tablet01Icon,
  Tag01Icon,
  Tick02Icon,
  Tv01Icon,
  Tv02Icon,
  UnavailableIcon,
  Undo03Icon,
  UserIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
  Wrench01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  ClaudeIcon,
  GitHubIcon,
  GoogleIcon,
  LinkedInIcon,
  MarkdownIcon,
  OpenAIIcon,
  XIcon,
  YouTubeIcon,
} from './brands'
import type { IconProps, SvgIcon } from './utils'
import { getSvgSizeProps } from './utils'

export type { Icon } from './utils'

const DEFAULT_STROKE_WIDTH = 2

const toStrokeWidth = (value: IconProps['strokeWidth']) => {
  const parsed = typeof value === 'string' ? Number.parseFloat(value) : value

  return typeof parsed === 'number' && Number.isFinite(parsed)
    ? parsed
    : DEFAULT_STROKE_WIDTH
}

// Decorative unless the caller labels it
const isLabelled = (props: IconProps) =>
  Object.keys(props).some(
    (key) =>
      (key.startsWith('aria-') && key !== 'aria-hidden') ||
      key === 'role' ||
      key === 'title'
  )

const hugeIcon = (icon: IconSvgElement): SvgIcon => {
  const Huge = ({ height, size, strokeWidth, width, ...props }: IconProps) => (
    <HugeiconsIcon
      aria-hidden={isLabelled(props) ? undefined : true}
      {...props}
      icon={icon}
      strokeWidth={toStrokeWidth(strokeWidth)}
      {...getSvgSizeProps({ height, size, width })}
    />
  )

  return Huge
}

export const Icons = {
  add: hugeIcon(PlusSignIcon),
  aiChat: hugeIcon(AiChat02Icon),
  arrowDown: hugeIcon(ArrowDown02Icon),
  arrowLeft: hugeIcon(ArrowLeft02Icon),
  arrowRight: hugeIcon(ArrowRight02Icon),
  arrowUp: hugeIcon(ArrowUp02Icon),
  arrowUpRight: hugeIcon(ArrowUpRight01Icon),
  ban: hugeIcon(UnavailableIcon),
  blog: hugeIcon(Notebook01Icon),
  brain: hugeIcon(BrainIcon),
  calendar: hugeIcon(Calendar03Icon),
  check: hugeIcon(Tick02Icon),
  chevronDown: hugeIcon(ChevronDownIcon),
  chevronLeft: hugeIcon(ChevronLeftIcon),
  chevronRight: hugeIcon(ChevronRightIcon),
  claude: ClaudeIcon,
  close: hugeIcon(Cancel01Icon),
  code: hugeIcon(CodeIcon),
  codeXml: hugeIcon(SourceCodeSquareIcon),
  comment: hugeIcon(Comment01Icon),
  compass: hugeIcon(DiscoverCircleIcon),
  copy: hugeIcon(Copy01Icon),
  cornerDownLeft: hugeIcon(CornerDownLeftIcon),
  desktop: hugeIcon(Tv02Icon),
  download: hugeIcon(Download01Icon),
  ellipsis: hugeIcon(MoreVerticalIcon),
  eraser: hugeIcon(EraserIcon),
  error: hugeIcon(MultiplicationSignCircleIcon),
  experience: hugeIcon(Briefcase01Icon),
  featured: hugeIcon(StarIcon),
  feedPublic: hugeIcon(Globe02Icon),
  gitBranch: hugeIcon(GitBranchIcon),
  gitCommit: hugeIcon(GitCommitHorizontalIcon),
  github: GitHubIcon,
  githubMark: GitHubIcon,
  gitPullRequest: hugeIcon(GitPullRequestIcon),
  gitTag: hugeIcon(Tag01Icon),
  globe: hugeIcon(Globe02Icon),
  google: GoogleIcon,
  home: hugeIcon(Home01Icon),
  info: hugeIcon(InformationCircleIcon),
  issueClosed: hugeIcon(CheckmarkCircle01Icon),
  issueOpened: hugeIcon(CircleDotIcon),
  issueReopened: hugeIcon(RefreshCcwDotIcon),
  issueTrackedBy: hugeIcon(ListTreeIcon),
  issueTracks: hugeIcon(ListChecksIcon),
  link: hugeIcon(Link01Icon),
  linkedin: LinkedInIcon,
  logIn: hugeIcon(Login03Icon),
  logOut: hugeIcon(Logout03Icon),
  mail: hugeIcon(Mail01Icon),
  markdown: MarkdownIcon,
  menu: hugeIcon(Menu01Icon),
  messageSquare: hugeIcon(Message01Icon),
  mobile: hugeIcon(SmartPhone01Icon),
  moon: hugeIcon(Moon02Icon),
  moreHorizontal: hugeIcon(MoreHorizontalCircle01Icon),
  openai: OpenAIIcon,
  page: hugeIcon(File01Icon),
  pawPrint: hugeIcon(PawPrintIcon),
  pencil: hugeIcon(PencilEdit01Icon),
  post: hugeIcon(File02Icon),
  quote: hugeIcon(QuoteUpIcon),
  redo: hugeIcon(Redo03Icon),
  refresh: hugeIcon(RefreshIcon),
  repo: hugeIcon(RepositoryIcon),
  repoForked: hugeIcon(GitForkIcon),
  rss: hugeIcon(RssIcon),
  search: hugeIcon(Search01Icon),
  send: hugeIcon(SentIcon),
  share: hugeIcon(Share08Icon),
  spinner: hugeIcon(Loading03Icon),
  square: hugeIcon(SquareIcon),
  star: hugeIcon(StarIcon),
  success: hugeIcon(CheckmarkCircle01Icon),
  sun: hugeIcon(Sun03Icon),
  tablet: hugeIcon(Tablet01Icon),
  tag: hugeIcon(Tag01Icon),
  trash: hugeIcon(Delete02Icon),
  tv: hugeIcon(Tv01Icon),
  undo: hugeIcon(Undo03Icon),
  user: hugeIcon(UserIcon),
  verifiedAdmin: hugeIcon(CheckmarkBadge02Icon),
  volumeOff: hugeIcon(VolumeMute02Icon),
  volumeOn: hugeIcon(VolumeHighIcon),
  warning: hugeIcon(Alert02Icon),
  work: hugeIcon(Briefcase02Icon),
  wrench: hugeIcon(Wrench01Icon),
  x: XIcon,
  youtube: YouTubeIcon,
}
