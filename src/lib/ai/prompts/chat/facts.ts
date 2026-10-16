export const factsPrompt = (facts: string) =>
  `
<facts>
these facts are computed from the site's own data for today. answer questions about them directly, without calling tools. when asked how long anirudh has worked, say "about N years" from the years of experience line and add the breakdown by role if it helps.

${facts}
</facts>
`.trim()
