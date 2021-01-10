"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const tslib_1 = require("tslib");
const arg_1 = tslib_1.__importDefault(require("arg"));
const Prompt_js_1 = tslib_1.__importDefault(require("./Prompt.js"));
const main_1 = require("./main");
const clear_1 = tslib_1.__importDefault(require("clear"));
const figlet_1 = tslib_1.__importDefault(require("figlet"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg_1.default({
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '-g': '--git',
        '-i': '--install',
        '-y': '--yes',
    }, {
        argv: rawArgs.slice(2),
        permissive: true,
    });
    console.log(args._[0]);
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: null,
        runInstall: args['--install'] || false,
        suppliedDirectory: args._[0],
    };
}
async function missingOptionsPrompt(options) {
    const prompter = new Prompt_js_1.default();
    let answers = {
        template: null,
        name: '',
        pkgmanager: 'yarn',
        git: true,
        runInstall: true,
        suppliedDirectory: options.suppliedDirectory,
        targetDirectory: '',
    };
    Object.assign(answers, await prompter.getName());
    if (!options.template) {
        Object.assign(answers, await prompter.getTemplate());
    }
    if (!options.git) {
        Object.assign(answers, await prompter.getGit());
    }
    if (!options.runInstall) {
        Object.assign(answers, await prompter.getInstall());
    }
    Object.assign(answers, await prompter.packageManager());
    if (answers.template !== 'typescript') {
        if (answers.template !== 'javascript') {
            Object.assign(answers, await prompter.language());
        }
    }
    if (answers.language === 'typescript' || answers.template === 'typescript') {
        Object.assign(answers, await prompter.setupTs());
    }
    if (answers.template === 'discordjs') {
        Object.assign(answers, await prompter.getCredentials());
        Object.assign(answers, await prompter.getOwnerId());
    }
    return answers;
}
async function cli(args) {
    clear_1.default();
    console.log(chalk_1.default.red(figlet_1.default.textSync("Midka's tools", { horizontalLayout: 'full' })));
    let options = parseArgumentsIntoOptions(args);
    options = await missingOptionsPrompt(options);
    console.log(options);
    await main_1.createProject(options);
}
exports.cli = cli;
