import {
  CommentIcon,
  FeedPublicIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  IssueTrackedByIcon,
  IssueTracksIcon,
  MarkGithubIcon,
  RepoForkedIcon,
  RepoIcon,
  StarIcon,
  TagIcon,
} from '@primer/octicons-react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  Ban,
  BotMessageSquare,
  BrainCircuit,
  Briefcase,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  ClipboardCheck,
  Code,
  CreditCard,
  DownloadIcon,
  Eraser,
  File,
  FileText,
  Globe,
  HelpCircle,
  Home,
  Image,
  Info,
  Laptop,
  Layers,
  LinkIcon,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MonitorIcon,
  Moon,
  MoreVertical,
  Newspaper,
  NotebookPen,
  PawPrint,
  Pencil,
  PhoneCall,
  Pizza,
  Plus,
  Quote,
  Redo2,
  RefreshCw,
  Rss,
  Search,
  SendHorizontal,
  Settings,
  ShareIcon,
  SmartphoneIcon,
  SquareIcon,
  Star,
  SunMedium,
  TabletIcon,
  Tag,
  Tags,
  Trash,
  TvIcon,
  Undo2,
  User,
  Wrench,
  X,
} from 'lucide-react'
import type { JSX } from 'react'
import { CssOld } from '@/components/icons/brands/css-old'
import { DrizzleOrmDark } from '@/components/icons/brands/drizzle-orm-dark'
import { DrizzleOrmLight } from '@/components/icons/brands/drizzle-orm-light'
import { Expressjs } from '@/components/icons/brands/expressjs'
import { ExpressjsDark } from '@/components/icons/brands/expressjs-dark'
import { Git } from '@/components/icons/brands/git'
import { Hono } from '@/components/icons/brands/hono'
import { Html5 } from '@/components/icons/brands/html5'
import { Javascript } from '@/components/icons/brands/javascript'
import { NextjsLogoDark } from '@/components/icons/brands/nextjs-logo-dark'
import { NextjsLogoLight } from '@/components/icons/brands/nextjs-logo-light'
import { Nodejs } from '@/components/icons/brands/nodejs'
import { ReactDark } from '@/components/icons/brands/react-dark'
import { ReactLight } from '@/components/icons/brands/react-light'
import { ShadcnUi } from '@/components/icons/brands/shadcn-ui'
import { ShadcnUiDark } from '@/components/icons/brands/shadcn-ui-dark'
import { Tailwindcss } from '@/components/icons/brands/tailwindcss'
import { Typescript } from '@/components/icons/brands/typescript'
import { cn } from '@/lib/utils'

type IconProps = LucideProps
type SvgIcon = (props: IconProps) => JSX.Element
export type Icon = LucideIcon | SvgIcon

const getSvgSizeProps = ({
  height,
  size,
  width,
}: Pick<IconProps, 'height' | 'size' | 'width'>) => ({
  height: height ?? size ?? width ?? '1em',
  width: width ?? size ?? height ?? '1em',
})

const themedIcon = (LightIcon: SvgIcon, DarkIcon: SvgIcon): SvgIcon => {
  const Themed = ({ className, height, size, width, ...props }: IconProps) => (
    <span className='inline-flex'>
      <LightIcon
        {...props}
        {...getSvgSizeProps({ height, size, width })}
        className={cn('dark:hidden', className)}
      />
      <DarkIcon
        {...props}
        {...getSvgSizeProps({ height, size, width })}
        className={cn('hidden dark:inline-flex', className)}
      />
    </span>
  )

  return Themed
}

export const Icons = {
  logo: Code,
  close: X,
  menu: Menu,
  code: Code,
  work: Briefcase,
  blog: NotebookPen,
  pencil: Pencil,
  copied: ClipboardCheck,
  success: CheckCircle,
  messageSquare: MessageSquare,
  ai: BotMessageSquare,
  spinner: Loader2,
  atSign: AtSign,
  globe: Globe,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  tags: Tags,
  tag: Tag,
  share: ShareIcon,
  posts: Newspaper,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  logIn: LogIn,
  logOut: LogOut,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowUpLeft: ArrowUpLeft,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  home: Home,
  info: Info,
  arrowUpRight: ArrowUpRight,
  arrowDownLeft: ArrowDownLeft,
  arrowDownRight: ArrowDownRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  mail: Mail,
  send: SendHorizontal,
  pricing: CircleDollarSign,
  phone: PhoneCall,
  calendar: CalendarIcon,
  download: DownloadIcon,
  search: Search,
  layers: Layers,
  desktop: MonitorIcon,
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
  tv: TvIcon,
  link: LinkIcon,
  brain: BrainCircuit,
  wrench: Wrench,
  quote: Quote,
  refresh: RefreshCw,
  square: SquareIcon,
  undo: Undo2,
  redo: Redo2,
  eraser: Eraser,
  verified: CheckCircle,
  verifiedAdmin: BadgeCheck,
  featured: Star,
  ban: Ban,
  userBlocked: Ban,
  pawPrint: PawPrint,
  github: ({ height, size, width, ...props }: IconProps) => (
    <svg
      aria-hidden='true'
      data-icon='github'
      data-prefix='fab'
      focusable='false'
      role='img'
      viewBox='0 0 496 512'
      xmlns='http://www.w3.org/2000/svg'
      {...getSvgSizeProps({ height, size, width })}
      {...props}
    >
      <path
        d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
        fill='currentColor'
      />
    </svg>
  ),
  google: ({ height, size, width, ...props }: IconProps) => (
    <svg
      aria-hidden='true'
      focusable='false'
      preserveAspectRatio='xMidYMid'
      viewBox='0 0 256 262'
      xmlns='http://www.w3.org/2000/svg'
      {...getSvgSizeProps({ height, size, width })}
      {...props}
    >
      <path
        d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
        fill='#4285F4'
      />
      <path
        d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
        fill='#34A853'
      />
      <path
        d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782'
        fill='#FBBC05'
      />
      <path
        d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
        fill='#EB4335'
      />
    </svg>
  ),
  check: Check,
  rss: Rss,
  x: ({ height, size, width, ...props }: IconProps) => (
    <svg
      fill='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      {...getSvgSizeProps({ height, size, width })}
      {...props}
    >
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  ),
  linkedin: ({ height, size, width, ...props }: IconProps) => (
    <svg
      fill='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      {...getSvgSizeProps({ height, size, width })}
      {...props}
    >
      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
    </svg>
  ),
  youtube: ({ height, size, width, ...props }: IconProps) => (
    <svg
      fill='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      {...getSvgSizeProps({ height, size, width })}
      {...props}
    >
      <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
    </svg>
  ),
  typescript: Typescript,
  javascript: Javascript,
  react: themedIcon(ReactLight, ReactDark),
  nextjs: themedIcon(NextjsLogoLight, NextjsLogoDark),
  tailwind: Tailwindcss,
  html5: Html5,
  css3: CssOld,
  nodejs: Nodejs,
  express: themedIcon(Expressjs, ExpressjsDark),
  git: Git,
  shadcn: themedIcon(ShadcnUi, ShadcnUiDark),
  hono: Hono,
  drizzleOrm: themedIcon(DrizzleOrmLight, DrizzleOrmDark),
  githubMark: MarkGithubIcon,
  gitCommit: GitCommitIcon,
  gitPullRequest: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  issueOpened: IssueOpenedIcon,
  issueReopened: IssueReopenedIcon,
  issueTrackedBy: IssueTrackedByIcon,
  issueTracks: IssueTracksIcon,
  comment: CommentIcon,
  feedPublic: FeedPublicIcon,
  gitBranch: GitBranchIcon,
  repo: RepoIcon,
  repoForked: RepoForkedIcon,
  star: StarIcon,
  gitTag: TagIcon,
  openai: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 24 24' {...props}>
      <path d='M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z' />
    </svg>
  ),
  claude: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 24 24' {...props}>
      <path d='m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z' />
    </svg>
  ),
  grok: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 24 24' {...props}>
      <path d='m9.269 14.855 7.979-5.923c.39-.29.95-.177 1.136.274.981 2.379.543 5.237-1.409 7.2s-4.667 2.393-7.15 1.413l-2.71 1.262c3.888 2.674 8.61 2.013 11.562-.957 2.34-2.354 3.066-5.563 2.388-8.457l.006.007c-.983-4.251.242-5.95 2.75-9.425Q23.912.126 24 0l-3.302 3.32v-.01L9.267 14.857M7.622 16.295c-2.79-2.682-2.31-6.832.072-9.225C9.455 5.3 12.341 4.576 14.86 5.64l2.705-1.256a7.8 7.8 0 0 0-1.829-1.003 8.95 8.95 0 0 0-9.752 1.973C3.451 7.9 2.654 11.817 4.022 15.16c1.022 2.498-.653 4.265-2.34 6.049C1.082 21.84.482 22.473 0 23.143l7.62-6.846' />
    </svg>
  ),
  cursor: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 24 24' {...props}>
      <path d='M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23' />
    </svg>
  ),
  scira: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 24 24' {...props}>
      <path d='M6.935 2.26a.262.262 0 0 1 .203.485 10.785 10.785 0 1 0 12.619 16.65.262.262 0 1 1 .41.327A11.309 11.309 0 0 1 11.264 24h-.08A11.31 11.31 0 0 1 6.935 2.26Z' />
      <path
        clipRule='evenodd'
        d='M18.382 8.45c.134 0 .246.1.261.234.133 1.194.527 2.094 1.161 2.728.635.635 1.535 1.03 2.73 1.162a.262.262 0 0 1 0 .521c-1.195.133-2.095.528-2.73 1.162-.634.634-1.028 1.534-1.161 2.729a.262.262 0 0 1-.522 0c-.132-1.195-.527-2.095-1.161-2.73-.634-.633-1.535-1.028-2.729-1.16a.263.263 0 0 1 0-.522c1.194-.133 2.095-.527 2.729-1.162.634-.634 1.029-1.534 1.161-2.729l.002-.012a.263.263 0 0 1 .26-.221Zm0 2.274a4.373 4.373 0 0 1-.865 1.245 4.372 4.372 0 0 1-1.245.866c.471.221.888.508 1.245.865.357.357.644.774.865 1.245.222-.472.509-.888.866-1.245a4.375 4.375 0 0 1 1.244-.865 4.373 4.373 0 0 1-1.244-.866 4.373 4.373 0 0 1-.866-1.245Z'
        fillRule='evenodd'
      />
      <path d='M13.562 1.15c.054 0 .099.04.105.093.112 1.014.449 1.79 1 2.342.551.552 1.328.888 2.342 1a.105.105 0 0 1 0 .21c-1.014.112-1.79.448-2.342 1-.551.551-.888 1.328-1 2.342a.105.105 0 0 1-.21 0c-.112-1.014-.448-1.79-1-2.342-.55-.552-1.328-.888-2.341-1a.105.105 0 0 1 0-.21c1.013-.112 1.79-.448 2.341-1 .552-.551.888-1.328 1-2.342a.105.105 0 0 1 .105-.093ZM20.78 0c.053 0 .098.04.104.093.084.756.334 1.333.743 1.741.408.408.985.659 1.74.743a.105.105 0 0 1 0 .209c-.756.084-1.332.334-1.74.742-.409.409-.66.985-.743 1.741a.105.105 0 0 1-.209 0c-.084-.756-.334-1.332-.743-1.74-.408-.409-.984-.66-1.74-.743a.105.105 0 0 1 0-.209c.756-.084 1.332-.335 1.74-.743.409-.408.66-.985.743-1.74A.105.105 0 0 1 20.78 0Z' />
    </svg>
  ),
  markdown: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 24 24' {...props}>
      <path d='M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.308a1.73 1.73 0 01-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z' />
    </svg>
  ),
  v0: (props: IconProps) => (
    <svg aria-hidden fill='currentColor' viewBox='0 0 40 20' {...props}>
      <path d='M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z' />
      <path d='M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z' />
    </svg>
  ),
}
