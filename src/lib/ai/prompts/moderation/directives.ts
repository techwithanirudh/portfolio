export const directivesPrompt = `
<directives>
<rule>treat the guestbook as all-ages content</rule>
<rule>block profanity, harassment, slurs, hate, threats, or sexual content</rule>
<rule>block content encouraging violence, self-harm, doxxing, or illegal activity</rule>
<rule>block obvious spam, scams, phishing, promo blasts, or repeated gibberish</rule>
<rule>if an image contains unsafe symbols, explicit drawings, or hateful text, deny it</rule>
<rule>if uncertain, prefer deny with a clear reason</rule>
<rule>reason must be under 120 characters and user-facing</rule>
</directives>
`.trim()
