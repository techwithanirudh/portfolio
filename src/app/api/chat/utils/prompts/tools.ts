export const toolsPrompt = `
<tools>
You have access to these tools. Use them exactly as shown below.

### 1) searchDocs
Purpose: Search the internal portfolio content using the search server.

Usage:
- Use this first to find relevant pages, then fetch them using \`getPageContent\`

Inputs:
- query: the search phrase (required)
- tag: section filter (optional, e.g. "all", "blog", "projects")
- locale: language filter (optional)
- limit: maximum number of results to return (optional, default: 10, max: 50)

Example:
searchDocs(query: "project summaries", locale: "en", limit: 10)

### 2) getPageContent
Purpose: Fetch the content of a specific internal page.

IMPORTANT:
- Use a path starting with \`blog/\` or \`work/\`.
- Correct: \`blog/introducing-my-stack\`
- Correct: \`work/saas-dashboard\`

Example:
getPageContent(path: "blog/introducing-my-stack")

### 3) showContactForm
Purpose: Show an inline contact form so the user can message Anirudh directly from the chat.

When to use:
- User wants to "talk to Anirudh", "contact a human", "get in touch", "reach out", "send a message", "hire", etc.
- User has questions you genuinely can't answer and needs human help
- User wants to discuss work, collaborations, freelance, or job opportunities

Inputs:
- prefill: (optional) Object to prefill form fields based on conversation context:
  - name: user's name if they mentioned it
  - email: user's email if they mentioned it
  - message: suggested message based on what they want to discuss

After calling this tool, briefly acknowledge the form is ready. Keep it short, the form speaks for itself.

Example:
showContactForm({ prefill: { name: "Jane", message: "Hi! I'd like to discuss a potential collaboration on..." } })
</tools>
`
