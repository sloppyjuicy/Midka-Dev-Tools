export interface Answers {
  template: 'discordjs' | 'javascript' | 'typescript' | null;
  name: string;
  pkgmanager: 'yarn' | 'npm';
  language?: 'javascript' | 'typescript';
  token?: string;
  prefix?: string;
  setup?: boolean;
  git: boolean;
  runInstall: boolean;
  ownerId?: string;
  suppliedDirectory: string;
  targetDirectory: string;
}

export interface Args {
  skipPrompts?: boolean;
  git: boolean;
  template: 'discordjs' | 'javascript' | 'typescript' | string | null;
  runInstall: boolean;
  targetDirectory?: string;
  templateDir?: string;
  [key: string]: any;
}

export interface DiscordBotConfig {
  token: string;
  prefix: string;
  ownerId: string;
}
