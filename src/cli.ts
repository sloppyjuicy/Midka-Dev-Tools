import arg from 'arg';
import Prompter from './Prompt.js';
import { createProject } from './main';
import { Answers, Args } from './types';
import clear from 'clear';
import figlet from 'figlet';
import chalk from 'chalk';
import path from 'path';

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
    template: 'javascript',
    name: '',
    pkgmanager: 'yarn',
    language: 'javascript',
    setup: false,
    git: true,
    runInstall: true,
    targetDirectory: path.resolve(process.cwd(), options.suppliedDirectory),
  };

  // Prompting for answers

  console.log(answers.targetDirectory);

  // Getting project's name
  addToAnswers(await prompter.getName());

  // If not template supplied then asking for it
  if (!options.template) {
    addToAnswers(await prompter.getTemplate());
  }

  // If not git argument passed then asking for it
  if (!options.git) {
    addToAnswers(await prompter.getGit());
  }

  // If not install argument passed then asking for it
  if (!options.runInstall) {
    addToAnswers(await prompter.getInstall());

    // Gettings preferred package manager to install packages
    addToAnswers(await prompter.packageManager());
  }

  // Getting language for discord bot
  if (answers.template !== 'typescript') {
    if (answers.template !== 'javascript') {
      addToAnswers(await prompter.language());
    }
  }

  // Asking should i setup typescript
  if (answers.language === 'typescript' || answers.template === 'typescript') {
    addToAnswers(await prompter.setupTs());
  }

  // Getting bot token and prefix and ownerId
  if (answers.template === 'discordjs') {
    addToAnswers(await prompter.getCredentials());

    // Getting ownerId
    addToAnswers(await prompter.getOwnerId());
  }

  function addToAnswers(answer: any) {
    Object.assign(answers, answer);
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
