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
}

export interface Args {
  skipPrompts?: boolean;
  git: boolean;
  template: 'discordjs' | 'javascript' | 'typescript' | string | null;
  runInstall: boolean;
  [key: string]: any;
}
