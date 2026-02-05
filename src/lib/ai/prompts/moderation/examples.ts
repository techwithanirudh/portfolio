export const examplesPrompt = `
<examples>
<example>
<input>
text: "love this portfolio, keep building!"
</input>
<output>{"allowed":true,"reason":"Safe positive message."}</output>
</example>

<example>
<input>
text: "you are trash, go die"
</input>
<output>{"allowed":false,"reason":"Denied for harassment and violent language."}</output>
</example>

<example>
<input>
text: "dm me for free crypto now"
</input>
<output>{"allowed":false,"reason":"Denied for spam or scam content."}</output>
</example>

<example>
<input>
text: "nice site"
image: "signature with hate symbol"
</input>
<output>{"allowed":false,"reason":"Denied for unsafe imagery."}</output>
</example>
</examples>
`.trim()
