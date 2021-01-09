"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const prompts_1 = tslib_1.__importDefault(require("prompts"));
const questions_1 = require("./utils/questions");
class Prompt {
    async getCredentials() {
        const { token, prefix } = await prompts_1.default(questions_1.getCredentials);
        return { token, prefix };
    }
    async language() {
        const { language } = await prompts_1.default(questions_1.languageSelect);
        return { language };
    }
    async packageManager() {
        const { pkgmanager } = await prompts_1.default(questions_1.packageManager);
        return { pkgmanager };
    }
    async getName() {
        const { name } = await prompts_1.default(questions_1.getName);
        return { name };
    }
    async getTemplate() {
        const { template } = await prompts_1.default(questions_1.getTemplate);
        return { template };
    }
    async setupTs() {
        const { setupTs } = await prompts_1.default(questions_1.setupTypescript);
        return { setupTs };
    }
    async getGit() {
        const { git } = await prompts_1.default(questions_1.getGit);
        return { git };
    }
    async getInstall() {
        const { runInstall } = await prompts_1.default(questions_1.getInstall);
        return { runInstall };
    }
    async getOwnerId() {
        const { ownerId } = await prompts_1.default(questions_1.getOwnerId);
        return { ownerId };
    }
}
exports.default = Prompt;
