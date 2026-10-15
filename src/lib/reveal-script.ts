// Runs inline in <head>, before hydration, so content never waits on React.
// It flags <html> (the CSS only hides blocks while this flag is set, so a
// browser without JS just shows the page) and plays a Web Animation on each
// section block and [data-reveal-item] the first time it scrolls into view.
// Nothing touches the DOM's attributes, so hydration sees the server's HTML.
const reveal = () => {
  const root = document.documentElement
  if (!('IntersectionObserver' in window && 'animate' in root)) {
    return
  }
  root.dataset.reveal = ''
  // The first section is above the fold and holds the LCP, so it never hides
  const selector =
    ':is([data-slot="section-inner"] > *, [data-reveal-item]):not(#main-content [data-slot="section"]:nth-child(1 of [data-slot="section"]) *)'
  const still = window.matchMedia('(prefers-reduced-motion: reduce)')
  const seen = new WeakSet<Element>()
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue
        }
        const element = entry.target
        observer.unobserve(element)
        const delay =
          Number.parseFloat(
            getComputedStyle(element).getPropertyValue('--reveal-delay')
          ) || 0
        // fill: both holds opacity at 1 over the stylesheet's hidden state,
        // while translate falls back to the element's own value at the end
        element.animate(
          [
            { opacity: 0, translate: still.matches ? 'none' : '0 6px' },
            { opacity: 1 },
          ],
          {
            delay: delay * 1000,
            duration: 450,
            easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
            fill: 'both',
          }
        )
      }
    },
    { rootMargin: '0px 0px -4% 0px' }
  )
  let queued = false
  const scan = () => {
    queued = false
    for (const element of document.querySelectorAll(selector)) {
      if (!seen.has(element)) {
        seen.add(element)
        observer.observe(element)
      }
    }
  }
  // Client side navigations swap the page in, so keep watching for new blocks
  new MutationObserver(() => {
    if (!queued) {
      queued = true
      requestAnimationFrame(scan)
    }
  }).observe(root, { childList: true, subtree: true })
}

export const revealScript = `(${reveal.toString()})()`
