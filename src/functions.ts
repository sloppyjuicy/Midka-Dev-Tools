import arg from 'arg';

export const parseArgs = (argsR: any) => {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--template': String,
      '--name': String,
      '-g': '--git',
      '-i': '--install',
      '-y': '--yes',
    },
    {
      argv: argsR.slice(2),
      permissive: true,
    }
  );

  return {
    git: args['--git'] || false,
    skip: args['--install'] || false,
    install: args['--install'] || false,
    name: args['--name'],
    template: args['--template'],
    rest: args._,
  };
};
