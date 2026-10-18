import {
  AiChat02Icon,
  Alert02Icon,
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  BrainIcon,
  Briefcase01Icon,
  Briefcase02Icon,
  Cancel01Icon,
  CheckmarkBadge02Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Delete02Icon,
  DiscoverCircleIcon,
  Download01Icon,
  EraserIcon,
  File01Icon,
  File02Icon,
  Globe02Icon,
  Home01Icon,
  InformationCircleIcon,
  Link01Icon,
  Loading03Icon,
  Login03Icon,
  Logout03Icon,
  Mail01Icon,
  Menu01Icon,
  Message01Icon,
  Moon02Icon,
  MoreHorizontalCircle01Icon,
  MultiplicationSignCircleIcon,
  Notebook01Icon,
  PartyIcon,
  PencilEdit01Icon,
  PlusSignIcon,
  QuoteUpIcon,
  Redo03Icon,
  RefreshIcon,
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
  Wrench01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  CommentIcon,
  FeedPublicIcon,
  GitBranchIcon,
  GitCommitIcon,
  StarIcon as GitHubStarIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  IssueTrackedByIcon,
  IssueTracksIcon,
  MarkGithubIcon,
  RepoForkedIcon,
  RepoIcon,
  TagIcon,
} from '@primer/octicons-react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  type LucideIcon,
  PawPrint,
  Volume2,
  VolumeX,
} from 'lucide-react'
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

const DEFAULT_STROKE_WIDTH = 2

const toStrokeWidth = (value: IconProps['strokeWidth']) => {
  const parsed = typeof value === 'string' ? Number.parseFloat(value) : value

  return typeof parsed === 'number' && Number.isFinite(parsed)
    ? parsed
    : DEFAULT_STROKE_WIDTH
}

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

const lucideIcon = (Icon: LucideIcon): SvgIcon => {
  const Lucide = ({ height, size, width, ...props }: IconProps) => (
    <Icon {...getSvgSizeProps({ height, size, width })} {...props} />
  )

  return Lucide
}

export const Icons = {
  add: hugeIcon(PlusSignIcon),
  aiChat: hugeIcon(AiChat02Icon),
  arrowDown: lucideIcon(ArrowDown),
  arrowLeft: lucideIcon(ArrowLeft),
  arrowRight: lucideIcon(ArrowRight),
  arrowUp: lucideIcon(ArrowUp),
  arrowUpRight: lucideIcon(ArrowUpRight),
  ban: hugeIcon(UnavailableIcon),
  blog: hugeIcon(Notebook01Icon),
  brain: hugeIcon(BrainIcon),
  check: hugeIcon(Tick02Icon),
  chevronDown: lucideIcon(ChevronDown),
  chevronLeft: lucideIcon(ChevronLeft),
  chevronRight: lucideIcon(ChevronRight),
  claude: ClaudeIcon,
  close: hugeIcon(Cancel01Icon),
  codeXml: hugeIcon(SourceCodeSquareIcon),
  comment: CommentIcon,
  compass: hugeIcon(DiscoverCircleIcon),
  copy: hugeIcon(Copy01Icon),
  cornerDownLeft: lucideIcon(CornerDownLeft),
  desktop: hugeIcon(Tv02Icon),
  download: hugeIcon(Download01Icon),
  eraser: hugeIcon(EraserIcon),
  error: hugeIcon(MultiplicationSignCircleIcon),
  expand: hugeIcon(ArrowExpand01Icon),
  experience: hugeIcon(Briefcase01Icon),
  featured: hugeIcon(StarIcon),
  feedPublic: FeedPublicIcon,
  gitBranch: GitBranchIcon,
  gitCommit: GitCommitIcon,
  github: GitHubIcon,
  githubMark: MarkGithubIcon,
  gitPullRequest: GitPullRequestIcon,
  gitTag: TagIcon,
  globe: hugeIcon(Globe02Icon),
  google: GoogleIcon,
  home: hugeIcon(Home01Icon),
  info: hugeIcon(InformationCircleIcon),
  issueClosed: IssueClosedIcon,
  issueOpened: IssueOpenedIcon,
  issueReopened: IssueReopenedIcon,
  issueTrackedBy: IssueTrackedByIcon,
  issueTracks: IssueTracksIcon,
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
  party: hugeIcon(PartyIcon),
  pawPrint: lucideIcon(PawPrint),
  pencil: hugeIcon(PencilEdit01Icon),
  post: hugeIcon(File02Icon),
  quote: hugeIcon(QuoteUpIcon),
  redo: hugeIcon(Redo03Icon),
  refresh: hugeIcon(RefreshIcon),
  repo: RepoIcon,
  repoForked: RepoForkedIcon,
  rss: hugeIcon(RssIcon),
  search: hugeIcon(Search01Icon),
  send: hugeIcon(SentIcon),
  share: hugeIcon(Share08Icon),
  shrink: hugeIcon(ArrowShrink01Icon),
  spinner: hugeIcon(Loading03Icon),
  square: hugeIcon(SquareIcon),
  star: GitHubStarIcon,
  success: hugeIcon(CheckmarkCircle01Icon),
  sun: hugeIcon(Sun03Icon),
  tablet: hugeIcon(Tablet01Icon),
  tag: hugeIcon(Tag01Icon),
  trash: hugeIcon(Delete02Icon),
  tv: hugeIcon(Tv01Icon),
  undo: hugeIcon(Undo03Icon),
  user: hugeIcon(UserIcon),
  verifiedAdmin: hugeIcon(CheckmarkBadge02Icon),
  volumeOff: lucideIcon(VolumeX),
  volumeOn: lucideIcon(Volume2),
  warning: hugeIcon(Alert02Icon),
  work: hugeIcon(Briefcase02Icon),
  wrench: hugeIcon(Wrench01Icon),
  x: XIcon,
  youtube: YouTubeIcon,
}
