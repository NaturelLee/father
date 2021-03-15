#!/usr/bin/env node
const path = require('path');
const sao = require('sao');
const cac = require('cac');
const chalk = require('chalk');
const { version } = require('./package.json');

const generator = path.resolve(__dirname, '');

const cli = cac('father');

cli
  .command(
    'init [out-dir]',
    'Generate in a custom directory or current directory',
  )
  .option('--bff', 'Generate BFF scaffold, default is UI scaffold')
  .option(
    '-i, --info',
    'Print out debugging information relating to the local environment',
  )
  .option('--verbose', 'Show debug logs')
  .action((outDir = '.', cliOptions) => {
    console.log();
    console.log(chalk`{cyan gza-cli v${version}}`);
    console.log(chalk`✨  Generating godzilla application in {cyan ${outDir}}`);

    const { verbose, bff: useBFF } = cliOptions;
    const logLevel = verbose ? 4 : 2;
    process.env.useBFF = !!useBFF;

    // See https://sao.vercel.app/api.html#options
    sao({ generator, outDir, logLevel, npmClient: 'npm', cliOptions })
      .run()
      .catch((err) => {
        console.trace(err);
        process.exit(1);
      });
  });

cli.help();

cli.version(version);

cli.parse();
