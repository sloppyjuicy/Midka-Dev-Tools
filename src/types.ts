export interface Answers {
  template: 'discordjs' | 'javascript' | 'typescript';
  name: string;
  pkgmanager: 'yarn' | 'npm';
  language: 'typescript' | 'javascript';
  botConfig?: DiscordBotConfig;
  setup: boolean;
  git: boolean;
  runInstall: boolean;
  targetDirectory: string;
}

export interface Args {
  [key: string]: any;
}

export interface DiscordBotConfig {
  token: string;
  prefix: string;
  ownerId: string;
}
