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
const build_1 = require("./build");
const partials = [];
if ((0, fs_1.existsSync)(path_1.default.join(process.cwd(), 'bloom.json'))) {
    partials.push(JSON.parse((0, fs_1.readFileSync)(path_1.default.join(process.cwd(), 'bloom.json')).toString('utf-8')));
}
if ((0, fs_1.existsSync)(path_1.default.join(process.cwd(), 'package.json'))) {
    const pkg = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(process.cwd(), 'package.json')).toString('utf-8'));
    if (pkg.bloom) {
        partials.push(pkg.bloom);
    }
}
const config = (0, config_1.populateConfiguration)(...partials);
const bloomPackageFile = JSON.parse((0, fs_1.readFileSync)(`${__dirname}/../package.json`).toString('utf-8'));
const main = commander_1.program
    .name('Bloom 🌸')
    .description('Command-line tool for building a Bloom game')
    .version(bloomPackageFile.version)
    .addArgument(new commander_1.Argument('<target>', 'Selects the target to build for').choices(build_1.Targets))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.bundle.main', '-i --main'))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.out', '-o --out'))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.bundle.minify', '-m --minify'))
    .addOption((0, config_1.GetCommandLineOption)(config, 'build.bundle.sourcemaps', '-s --sourcemaps'))
    .action((target) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, build_1.build)(target).run(new build_1.Context(config));
    }
    catch (err) {
        console.log('Build failed.');
        throw err;
    }
}));
commander_1.program.parse(process.argv);
commander_1.program.exitOverride((err) => {
    console.error(err);
    process.exit(0);
});
