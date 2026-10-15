// The panel itself (./assistant) is left out so importing this barrel never
// pulls it into the main bundle; the app provider loads it with next/dynamic
export { AssistantProvider, useAssistantContext } from './context'
