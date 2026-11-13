import { celebrateTool } from './celebrate'
import { getPageContent } from './get-page-content'
import { navigateTool } from './navigate'
import { renderPortfolioTool } from './render-portfolio'
import { searchDocsTool } from './search-docs'
import { showContactFormTool } from './show-contact-form'

export const chatTools = {
  celebrate: celebrateTool,
  getPageContent,
  navigate: navigateTool,
  renderPortfolio: renderPortfolioTool,
  searchDocs: searchDocsTool,
  showContactForm: showContactFormTool,
}
