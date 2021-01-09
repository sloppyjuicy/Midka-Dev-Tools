import prompts from 'prompts';
import {
  getCredentials,
  getName,
  languageSelect,
  packageManager,
  getTemplate,
  setupTypescript,
  getGit,
  getInstall,
} from './utils/questions';

export default class Prompt {
  async getCredentials() {
    const { token, prefix } = await prompts(getCredentials);
    return { token, prefix };
  }

  async language() {
    const { language } = await prompts(languageSelect);
    return { language };
  }

  async packageManager() {
    const { pkgmanager } = await prompts(packageManager);
    return { pkgmanager };
  }

  async getName() {
    const { name } = await prompts(getName);
    return { name };
  }

  async getTemplate() {
    const { template } = await prompts(getTemplate);
    return { template };
  }

  async setupTs() {
    const { setupTs } = await prompts(setupTypescript);
    return { setupTs };
  }

  async getGit() {
    const { git } = await prompts(getGit);
    return { git };
  }

  async getInstall() {
    const { runInstall } = await prompts(getInstall);
    return { runInstall };
  }
}
