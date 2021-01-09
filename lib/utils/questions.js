"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstall = exports.getGit = exports.getTemplate = exports.getName = exports.setupTypescript = exports.getCredentials = exports.languageSelect = exports.packageManager = void 0;
exports.packageManager = {
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
exports.languageSelect = {
    type: 'select',
    name: 'language',
    message: 'Select a language',
    choices: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'JavaScript', value: 'javascript' },
    ],
};
exports.getCredentials = [
    {
        type: 'password',
        name: 'token',
        message: 'Enter your token',
        validate: (value) => value.length === 0 ? 'Cannot be empty' : true,
    },
    {
        type: 'text',
        name: 'prefix',
        message: 'Enter your prefix',
        validate: (value) => value.length === 0 ? 'Cannot be empty' : true,
    },
];
exports.setupTypescript = {
    type: 'confirm',
    name: 'setupTs',
    message: "Install TypeScript, ts-node, and setup tsconfig.json? You'll have to do this later if you skip this.",
    initial: true,
};
exports.getName = {
    type: 'text',
    name: 'name',
    message: 'Enter name for your project',
    validate: (value) => value.length === 0 ? `Project name cannot be empty!` : true,
};
exports.getTemplate = {
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
exports.getGit = {
    type: 'confirm',
    name: 'git',
    message: 'Do you want to initialize a Git repository?',
};
exports.getInstall = {
    type: 'confirm',
    name: 'runInstall',
    message: 'Do you want to install dependencies?',
};
