# TODO List

## 1. Apply Latest Changes from shadcn-saas-landing

Continue integrating the latest tooling and configuration from the shadcn-saas-landing repository.

### 1.1 Lefthook
- [ ] Install and configure Lefthook for Git hooks
- [ ] Set up pre-commit hooks for linting and formatting
- [ ] Set up pre-push hooks for tests/validation
- [ ] Configure commit-msg hook for commit message validation
- [ ] Update documentation for Git hooks

### 1.2 Commitlint
- [ ] Install commitlint and @commitlint/config-conventional
- [ ] Create commitlint.config.js with conventional commit rules
- [ ] Integrate with Lefthook commit-msg hook
- [ ] Add conventional commit guidelines to documentation
- [ ] Configure allowed commit types and scopes

### 1.3 Ultracite Linter
- [ ] Research and evaluate Ultracite linter
- [ ] Install Ultracite linter dependencies
- [ ] Configure Ultracite linter rules
- [ ] Integrate with existing Biome setup
- [ ] Update lint scripts in package.json
- [ ] Run linter across codebase and fix issues

### 1.4 CI/CD
- [ ] Set up GitHub Actions workflow for CI
- [ ] Add lint job (Biome + Ultracite)
- [ ] Add format check job
- [ ] Add type checking job
- [ ] Add build job
- [ ] Add link validation job
- [ ] Configure branch protection rules
- [ ] Add status badges to README

## 2. Implement Multi-Source Fumadocs

Implement separate documentation sources for `/work` and `/blog` using Fumadocs multi-source feature.

### 2.1 Research Fumadocs Multi-Source
- [ ] Read Fumadocs documentation from Context 7 MCP
- [ ] Understand multi-source configuration
- [ ] Review best practices for content separation
- [ ] Study existing Fumadocs examples

### 2.2 Configure Blog Source
- [ ] Update source.config.ts for blog source
- [ ] Configure blog content directory mapping
- [ ] Set up blog metadata and frontmatter schema
- [ ] Update blog route handlers for multi-source
- [ ] Test blog pages with new source configuration

### 2.3 Configure Work/Projects Source
- [ ] Create separate work/projects source in source.config.ts
- [ ] Configure projects content directory mapping
- [ ] Set up projects metadata and frontmatter schema
- [ ] Update work route handlers for multi-source
- [ ] Test project pages with new source configuration

### 2.4 Update Source Utilities
- [ ] Refactor `src/lib/source/blog.ts` for multi-source
- [ ] Refactor `src/lib/source/projects.ts` for multi-source
- [ ] Update `src/lib/source/index.ts` exports
- [ ] Ensure backward compatibility
- [ ] Add TypeScript types for both sources

### 2.5 Testing
- [ ] Test blog listing page with new source
- [ ] Test blog detail pages with new source
- [ ] Test work listing page with new source
- [ ] Test work detail pages with new source
- [ ] Verify MDX rendering for both sources
- [ ] Test tag filtering for both sources

## 3. Add Missing Animations

Restore and add animations to components that are missing them.

### 3.1 Header Animations
- [ ] Add ViewAnimation to header navigation items
- [ ] Add staggered animations for nav links
- [ ] Animate logo/brand on load
- [ ] Add smooth transitions for mobile menu
- [ ] Center header layout like the original design
- [ ] Test header animations on desktop
- [ ] Test header animations on mobile

### 3.2 Component Animations
- [ ] Audit all components for missing animations
- [ ] Add animations to About section
- [ ] Add animations to Skills section
- [ ] Add animations to Testimonials section
- [ ] Add animations to CTA section
- [ ] Add animations to Logos section
- [ ] Add animations to Roles component
- [ ] Add animations to Footer sections
- [ ] Ensure consistent animation delays and transitions

### 3.3 Page Transitions
- [ ] Review ViewTransition usage across pages
- [ ] Add page transitions for route changes
- [ ] Ensure smooth transitions between blog/work pages
- [ ] Test transitions with browser back/forward
- [ ] Optimize animation performance

### 3.4 Scroll Animations
- [ ] Verify scroll-based animations work correctly
- [ ] Add entrance animations for sections
- [ ] Configure viewport triggers appropriately
- [ ] Test on different screen sizes
- [ ] Optimize for mobile performance

## 4. Add Missing Sections and Content

Restore sections and content from the original site that are missing in the current version.

### 4.1 Content Audit
- [ ] Compare current site with old site (via git history)
- [ ] Identify missing sections on homepage
- [ ] Identify missing sections on about page
- [ ] Identify missing sections on work/projects page
- [ ] Document all missing content

### 4.2 Restore Homepage Content
- [ ] Restore original hero copy and styling
- [ ] Add missing sections (if any)
- [ ] Update testimonials with original content
- [ ] Restore original CTA messaging
- [ ] Update meta descriptions and SEO content

### 4.3 Restore About Page Content
- [ ] Restore original about page content
- [ ] Add missing biography sections
- [ ] Restore timeline/experience content
- [ ] Add skills and technologies section
- [ ] Update images and media

### 4.4 Restore Work/Projects Content
- [ ] Restore original project descriptions
- [ ] Add missing project entries
- [ ] Restore project metadata (dates, tags, etc.)
- [ ] Update project images and screenshots
- [ ] Restore external links and demos

### 4.5 Restore Blog Content
- [ ] Verify all blog posts are present
- [ ] Restore missing blog metadata
- [ ] Update author information
- [ ] Restore blog images
- [ ] Verify tags and categories

### 4.6 Other Content
- [ ] Restore footer content and links
- [ ] Update contact information
- [ ] Restore social media links
- [ ] Add privacy policy/terms (if existed)
- [ ] Update 404 page content

## 5. Quality Assurance

Final testing and validation before deployment.

### 5.1 Functionality Testing
- [ ] Test all navigation links
- [ ] Test all forms (contact, newsletter)
- [ ] Test tag filtering
- [ ] Test search functionality
- [ ] Test dark/light mode toggle
- [ ] Test responsive design (mobile, tablet, desktop)

### 5.2 Performance Testing
- [ ] Run Lighthouse audit
- [ ] Optimize images and assets
- [ ] Check Core Web Vitals
- [ ] Optimize bundle size
- [ ] Test loading speed

### 5.3 Accessibility Testing
- [ ] Run accessibility audit
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify ARIA labels
- [ ] Check color contrast ratios

### 5.4 SEO Validation
- [ ] Verify meta tags on all pages
- [ ] Test Open Graph images
- [ ] Validate structured data (JSON-LD)
- [ ] Check sitemap generation
- [ ] Verify robots.txt

### 5.5 Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile browsers

## Notes

- Use `pnpm check` before committing changes
- Follow conventional commit format after commitlint setup
- Keep changes minimal and scoped
- Test animations on different devices/browsers
- Maintain TypeScript strict mode compatibility
- Follow existing code style and conventions

- Show a Github Contribution Graph from kibo-ui
- Fix Image Layout Shift issue
- Add an experience section like haydenbleasel.com...
- Add animations to ALL Parts of UI (including header)
- Show now playing spotify and have some uses like what tools i use


"""
/**
 * Kill all CSS animations/transitions and common motion styles.
 * Also cancels Web Animations API animations and keeps enforcing via MutationObserver.
 *
 * Usage:
 *   killAllAnimations();
 *   // later if needed:
 *   window.__restoreAnimations?.();
 */
function killAllAnimations(options = {}) {
  const {
    removeInlineMotionStyles = true, // strip inline animation/transition/transform/opacity
    cancelWebAnimations = true,      // cancel element.getAnimations()
    observeDOM = true,               // keep enforcing on future nodes
    alsoDisableScrollBehavior = true // prevents smooth scrolling animations
  } = options;

  const STYLE_ID = "__kill_animations_style__";
  const PREV_STYLE_ID = "__kill_animations_prev_style__";

  // Backup any existing style node we previously injected
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  // 1) CSS nuke: covers almost everything, including pseudo-elements and future nodes.
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: auto !important;
    }
    ${alsoDisableScrollBehavior ? `html { scroll-behavior: auto !important; }` : ""}
  `;
  document.documentElement.appendChild(style);

  // Helpers
  const INLINE_PROPS = [
    "animation",
    "animationName",
    "animationDuration",
    "animationTimingFunction",
    "animationDelay",
    "animationIterationCount",
    "animationDirection",
    "animationFillMode",
    "animationPlayState",
    "transition",
    "transitionProperty",
    "transitionDuration",
    "transitionTimingFunction",
    "transitionDelay"
  ];

  // Only strip these if you explicitly want to kill motion-y visuals too.
  // (Sometimes opacity/transform are used for layout/visual design, so this can be aggressive.)
  const INLINE_MOTION_VISUALS = ["transform", "opacity", "willChange", "filter"];

  function scrubInlineStyles(el) {
    if (!(el instanceof Element)) return;

    if (removeInlineMotionStyles && el.hasAttribute("style")) {
      for (const prop of INLINE_PROPS) el.style[prop] = "none";

      // Set duration to 0 where applicable (some libs re-add transitions)
      el.style.transitionDuration = "0s";
      el.style.animationDuration = "0s";
      el.style.animationDelay = "0s";
      el.style.transitionDelay = "0s";

      // Optionally kill transform/opacity animations by clearing values
      for (const prop of INLINE_MOTION_VISUALS) {
        // Only clear if it looks like it might be used for motion
        // (You can comment this out if it breaks visuals.)
        if (prop in el.style && el.style[prop]) el.style[prop] = "";
      }
    }
  }

  function cancelWAAPI(el) {
    if (!cancelWebAnimations) return;
    if (!(el instanceof Element)) return;

    // Cancel Web Animations API animations (including ones created by libraries)
    // getAnimations({ subtree: true }) is supported in modern browsers.
    try {
      const animations = el.getAnimations?.({ subtree: false }) || [];
      for (const a of animations) a.cancel();
    } catch {
      // ignore
    }
  }

  function processNode(node) {
    if (!(node instanceof Element)) return;

    scrubInlineStyles(node);
    cancelWAAPI(node);

    // Also process subtree efficiently
    const all = node.querySelectorAll?.("*");
    if (!all) return;
    for (const el of all) {
      scrubInlineStyles(el);
      cancelWAAPI(el);
    }
  }

  // Initial sweep
  processNode(document.documentElement);

  // Keep enforcing for new nodes / style changes
  let observer = null;
  if (observeDOM) {
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          for (const n of m.addedNodes) processNode(n);
        } else if (m.type === "attributes") {
          // If someone sets style/class that reintroduces motion, rescrub
          processNode(m.target);
        }
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });
  }

  // Optional: expose restore function
  window.__restoreAnimations = () => {
    document.getElementById(STYLE_ID)?.remove();
    observer?.disconnect();

    // We cannot reliably restore inline styles we blanked without tracking diffs.
    // If you need reversible behavior, we can add a snapshot/restore layer.
    delete window.__restoreAnimations;
  };

  return { styleNode: style, observer };
}

// Example call:
killAllAnimations({
  removeInlineMotionStyles: true,
  cancelWebAnimations: true,
  observeDOM: true,
  alsoDisableScrollBehavior: true
});
"""

Take inspiration from  https://chanhdai.com/

- Add Umami Analytics
- Add BotID
- Add Actual Content
- Add OLD Blogs