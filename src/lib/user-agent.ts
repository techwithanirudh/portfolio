export type PlatformType = 'desktop' | 'mobile' | 'tablet' | 'unknown'

export interface ParsedUserAgent {
  os: string
  browser: string
  browserVersion: string
  platform: PlatformType
}

const UA = {
  android: /android/i,
  ios: /iphone|ipad|ipod/i,
  macos: /mac\s?os|macintosh/i,
  windows: /windows/i,
  linux: /linux/i,
  chromeos: /cros/i,
  edge: /edg(?:e|a|ios)?\/(\d+[\d.]*)/i,
  chrome: /chrom(?:e|ium)\/(\d+[\d.]*)/i,
  firefox: /firefox\/(\d+[\d.]*)/i,
  safari: /version\/(\d+[\d.]*).*safari/i,
  isMobile: /mobile|android|iphone/i,
  isTablet: /tablet|ipad/i,
} as const

export function parseUserAgent(ua?: string | null): ParsedUserAgent {
  if (!ua) {
    return {
      os: 'Unknown',
      browser: 'Unknown',
      browserVersion: '',
      platform: 'unknown',
    }
  }

  let os = 'Unknown'
  if (UA.android.test(ua)) {
    os = 'Android'
  } else if (UA.ios.test(ua)) {
    os = 'iOS'
  } else if (UA.macos.test(ua)) {
    os = 'macOS'
  } else if (UA.windows.test(ua)) {
    os = 'Windows'
  } else if (UA.linux.test(ua)) {
    os = 'Linux'
  } else if (UA.chromeos.test(ua)) {
    os = 'ChromeOS'
  }

  let browser = 'Unknown'
  let browserVersion = ''

  const edgeMatch = ua.match(UA.edge)
  const chromeMatch = ua.match(UA.chrome)
  const firefoxMatch = ua.match(UA.firefox)
  const safariMatch = ua.match(UA.safari)

  if (edgeMatch) {
    browser = 'Edge'
    browserVersion = edgeMatch[1] ?? ''
  } else if (firefoxMatch) {
    browser = 'Firefox'
    browserVersion = firefoxMatch[1] ?? ''
  } else if (safariMatch) {
    browser = 'Safari'
    browserVersion = safariMatch[1] ?? ''
  } else if (chromeMatch) {
    browser = 'Chrome'
    browserVersion = chromeMatch[1] ?? ''
  }

  let platform: PlatformType = 'desktop'
  if (UA.isMobile.test(ua)) {
    platform = 'mobile'
  } else if (UA.isTablet.test(ua)) {
    platform = 'tablet'
  }

  return { os, browser, browserVersion, platform }
}
