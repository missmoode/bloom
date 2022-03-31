export interface Config {
  name: string,
  shortname?: string,
  iconSVGPath: string,
  themeColor: string,
  rootScript: string,
  resources: string | string[],
  outDir: string,
  production: boolean
}

export const defaults = {
  outDir: 'out',
  production: false
}