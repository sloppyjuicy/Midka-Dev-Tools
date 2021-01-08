import prompts from 'prompts'
import { getCredentials, languageSelect, packageManager, questions, setupTypescript } from './utils/questions'

export default class Prompt {

    async getCredentials() {
      const { token, prefix } = await prompts(getCredentials)
      return { token, prefix }
    }
  
    async language() {
      const { language } = await prompts(languageSelect)
      return { language }
    }
  
    async packageManager() {
      const { pkgmanager } = await prompts(packageManager)
      return { pkgmanager }
    }
  
    async setup() {
      const { template, name } = await prompts(questions)
      return { template, name }
    }
  
    async setupTs() {
      const { setup } = await prompts(setupTypescript)
      return { setup }
    }
  
}