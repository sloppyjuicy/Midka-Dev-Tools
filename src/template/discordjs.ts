import { PromptObject } from 'prompts';

export const getOwnerId: PromptObject = {
  type: 'text',
  name: 'ownerId',
  message: "Owner's discord id",
};

export const getBotCreds: PromptObject[] = [
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
