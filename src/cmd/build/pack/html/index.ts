import path from 'path';
import template from 'gulp-template';
import { src } from 'vinyl-fs';
import { Context } from '../../context';
import { TargetPreset } from '../target';

const copyHTML = {
  title: 'Drop in HTML template',
  task: async (context: Context) => {
    const html = src(`${__dirname}${path.sep}index.html`)
      .pipe(template({ title: context.config.productName, theme_color: context.config.presentation.themeColor }, { interpolate: /{{([\s\S]+?)}}/gs }));

    await context.artefacts.ingest(html);
  }
};
export const html: TargetPreset = {
  tasks: [copyHTML]
};