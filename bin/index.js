"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const commander_1 = require("commander");
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const tasks_1 = require("./tasks");
const context_1 = require("./tasks/context");
const packageFile = JSON.parse((0, fs_1.readFileSync)(`${__dirname}/../package.json`).toString('utf-8'));
let config;
if ((0, fs_1.existsSync)(path_1.default.join(process.cwd(), 'bloom.json'))) {
    config = (0, config_1.populateConfiguration)(JSON.parse((0, fs_1.readFileSync)(path_1.default.join(process.cwd(), 'bloom.json')).toString('utf-8')));
}
else {
    config = (0, config_1.populateConfiguration)({});
}
const main = commander_1.program
    .name(packageFile.name)
    .description(packageFile.description)
    .version(packageFile.version);
main.command('build')
    .description('Builds the game and places it in the output directory.')
    .addOption(new commander_1.Option('-p, --platform <platform>', 'Selects the platform to build for').choices(context_1.Platforms))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.bundle.main', '-i --main'))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.out', '-o --out'))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.bundle.minify', '-m --minify'))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.bundle.sourcemaps', '-s --sourcemaps'))
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, tasks_1.run)(config, options.platform, tasks_1.build);
    }
    catch (_a) {
        console.log('Build failed.');
        process.exit(1);
    }
}));
commander_1.program.parse(process.argv);
commander_1.program.exitOverride((err) => {
    process.exit(0);
});
