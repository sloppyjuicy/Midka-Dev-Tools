import arg from "arg";
import Prompter from './Prompt'
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-i": "--install",
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
  };
}

async function missingOptionsPrompt(options) {
  const prompter = new Prompter()
  let answers = {};
  
  // Prompting for answers
  Object.assign(answers, await prompter.setup())
  Object.assign(answers, await prompter.packageManager())
  console.log(answers.template)

  if (answers.template !== 'typescript') {
    if(answers.template !== 'javascript') {
      Object.assign(answers, await prompter.language())
    }
  }

  if (answers.languagetsjs === 'typescript') {
    Object.assign(answers, await prompter.setupTs())
  }

  if (answers.template === 'discordjs') {
    Object.assign(answers, await prompter.getCredentials())
  }

  console.log(answers)
  
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await missingOptionsPrompt(options);
  //await createProject(options);
}
