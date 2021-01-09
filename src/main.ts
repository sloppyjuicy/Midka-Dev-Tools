import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import { Args, DiscordBotConfig } from './types';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options: Args) {
  return copy(options.templateDir!, options.targetDirectory!, {
    clobber: false,
  });
}

async function initGit(options: Args) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(
      new Error('Something went wrong when creating Git repository!')
    );
  }
  return;
}

// This is for discordjs template
async function createConfig(options: Args) {
  let config: DiscordBotConfig = {
    token: options.token,
    prefix: options.prefix,
    ownerId: options.ownerId,
  };

  let data = JSON.stringify(config, null, 2);

  fs.writeFileSync('config.json', data);
}

export async function createProject(options: Args) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = __dirname
    .toString()
    .replace(
      'lib',
      'templates\\' + options.template!.toLowerCase() + '-template'
    )
    .toString();

  options = {
    ...options,
    templateDir,
  };
  try {
    await access(templateDir, fs.constants.R_OK).catch();
  } catch (error) {
    console.error(error);
    console.error('%s Something went wrong!', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy template files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Make Git repository',
      task: () => initGit(options),
      enabled: () => options.git === true,
    },
    {
      title: 'Generate bot configuration',
      task: () => createConfig(options),
      enabled: () => options.template === 'discordjs',
    },
    {
      title: 'Install Dependencies',
      task: () =>
        projectInstall({
          prefer: options.pkgmanager,
        }),
      skip: () =>
        !options.runInstall
          ? 'Put -i to the command to automatically install dependencies :)'
          : undefined,
    },
  ]);

  await tasks.run();

  console.log('%s Project Ready', chalk.green.bold('READY'));
  return true;
}
