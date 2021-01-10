import arg from 'arg';
import Prompter from './Prompt.js';
import { createProject } from './main';
import { Answers, Args } from './types';
import clear from 'clear';
import figlet from 'figlet';
import chalk from 'chalk';

function parseArgumentsIntoOptions(rawArgs: any) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-i': '--install',
      '-y': '--yes',
    },
    {
      argv: rawArgs.slice(2),
      permissive: true,
    }
  );

  console.log(args._[0]);
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: null,
    runInstall: args['--install'] || false,
    suppliedDirectory: args._[0],
  };
}

async function missingOptionsPrompt(options: Args) {
  const prompter = new Prompter();
  let answers: Answers = {
    template: null,
    name: '',
    pkgmanager: 'yarn',
    git: true,
    runInstall: true,
    suppliedDirectory: options.suppliedDirectory,
    targetDirectory: '',
  };

  // Prompting for answers

  // Getting project's name
  Object.assign(answers, await prompter.getName());

  // If not template supplied then asking for it
  if (!options.template) {
    Object.assign(answers, await prompter.getTemplate());
  }

  // If not git argument passed then asking for it
  if (!options.git) {
    Object.assign(answers, await prompter.getGit());
  }

  // If not install argument passed then asking for it
  if (!options.runInstall) {
    Object.assign(answers, await prompter.getInstall());
  }

  // Gettings preferred package manager to install packages
  Object.assign(answers, await prompter.packageManager());

  // Getting language for discord bot
  if (answers.template !== 'typescript') {
    if (answers.template !== 'javascript') {
      Object.assign(answers, await prompter.language());
    }
  }

  // Asking should i setup typescript
  if (answers.language === 'typescript' || answers.template === 'typescript') {
    Object.assign(answers, await prompter.setupTs());
  }

  // Getting bot token and prefix and ownerId
  if (answers.template === 'discordjs') {
    Object.assign(answers, await prompter.getCredentials());

    // Getting ownerId
    Object.assign(answers, await prompter.getOwnerId());
  }

  return answers;
}

export async function cli(args: Args) {
  clear();
  console.log(
    chalk.red(figlet.textSync("Midka's tools", { horizontalLayout: 'full' }))
  );
  let options: Args = parseArgumentsIntoOptions(args);
  options = await missingOptionsPrompt(options);
  console.log(options);
  await createProject(options);
}
