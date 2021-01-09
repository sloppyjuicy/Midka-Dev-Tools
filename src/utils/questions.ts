import { PromptObject } from 'prompts';

export const packageManager: PromptObject = {
  type: 'select',
  name: 'pkgmanager',
  message: 'Select preferred package manager',
  choices: [
    {
      title: 'yarn',
      value: 'yarn',
    },
    {
      title: 'npm',
      value: 'npm',
    },
  ],
};

export const languageSelect: PromptObject = {
  type: 'select',
  name: 'language',
  message: 'Select a language',
  choices: [
    { title: 'TypeScript', value: 'typescript' },
    { title: 'JavaScript', value: 'javascript' },
  ],
};

export const getCredentials: PromptObject[] = [
  {
    type: 'password',
    name: 'token',
    message: 'Enter your token',
    validate: (value: string) =>
      value.length === 0 ? 'Cannot be empty' : true,
  },
  {
    type: 'text',
    name: 'prefix',
    message: 'Enter your prefix',
    validate: (value: string) =>
      value.length === 0 ? 'Cannot be empty' : true,
  },
];

export const setupTypescript: PromptObject = {
  type: 'confirm',
  name: 'setupTs',
  message:
    "Install TypeScript, ts-node, and setup tsconfig.json? You'll have to do this later if you skip this.",
  initial: true,
};

export const getName: PromptObject = {
  type: 'text',
  name: 'name',
  message: 'Enter name for your project',
  validate: (value: string) =>
    value.length === 0 ? `Project name cannot be empty!` : true,
};

export const getTemplate: PromptObject = {
  type: 'select',
  name: 'template',
  message: 'What template do you want to use?',
  choices: [
    {
      title: 'Discord.Js',
      description: 'This will create simple discord bot with discord.js',
      value: 'discordjs',
    },
    {
      title: 'Javascript',
      description: 'This will install esm module for your javascript project',
      value: 'javascript',
    },
    {
      title: 'Typescript',
      description: 'This will setup a simple project with typescript',
      value: 'typescript',
    },
  ],
};

export const getGit: PromptObject = {
  type: 'confirm',
  name: 'git',
  message: 'Do you want to initialize a Git repository?',
};

export const getInstall: PromptObject = {
  type: 'confirm',
  name: 'runInstall',
  message: 'Do you want to install dependencies?',
};
