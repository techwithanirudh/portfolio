export const llmsPrompt = (llms: string) =>
  `
<context>
this is what the site shows today: about, story, experience, stack, testimonials, uses, colophon, contact and faq, a site map, and the lists of projects and blog posts.
answer from it directly when it covers the question. use \`searchDocs\` and \`getPageContent\` for the full text of a project or blog post.

${llms}
</context>
`.trim()
