const path = require('path');
const fs = require('fs');

const hasPkg = fs.existsSync(path.join(process.cwd(), 'package.json'));
let packageInfo = {};
if (hasPkg) {
  packageInfo = require(path.join(process.cwd(), 'package.json'));
}
module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project app',
        default: packageInfo.name || this.outFolder,
        filter: (val) => val.toLowerCase(),
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: packageInfo.description || '',
      },
      {
        name: 'version',
        message: 'What is the version of the new project',
        default: packageInfo.version || '1.0.0',
      },
    ];
  },
  actions: [
    {
      type: 'add',
      files: '**',
      filters: {
        '.gitignore': false,
      },
    },
    {
      type: 'modify',
      files: 'package.json',
      handler(data, filepath) {
        if (hasPkg) {
          packageInfo.name = data.name;
          packageInfo.description = data.description;
          packageInfo.version = data.version;
        }
        return data;
      },
    },
    {
      type: 'move',
      patterns: {},
    },
  ],
  templateDir: './lucy',
  async completed() {
    this.gitInit();
    this.npmClient = 'npm';
    await this.npmInstall();

    this.showProjectTips();

    const logCd = () => {
      if (this.outDir !== process.cwd()) {
        console.log(
          `${this.chalk.bold('cd')} ${this.chalk.cyan(
            path.relative(process.cwd(), this.outDir),
          )}`,
        );
      }
    };

    this.logger.tip(`To start dev server, run following commands:`);
    logCd();
    if (process.env.useBFF === 'true') {
      console.log(
        `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('run dev')}`,
      );
    } else {
      console.log(
        `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('start')}`,
      );
    }

    this.logger.tip(`To build for production, run following commands:`);
    logCd();
    if (process.env.useBFF) {
      console.log(
        `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('start')}`,
      );
    } else {
      console.log(
        `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('run dist')}`,
      );
    }
  },
};
