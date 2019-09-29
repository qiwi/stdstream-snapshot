import {IStringHandler} from './interface'

/**
 * Replaces `process.cwd()` prefix from any found paths in the output strings.
 * @ignore
 */
export const relatify: IStringHandler = (out: string, dirname: string) => {
  let index: number = 0
  const getIndex = () => {
    index = out.indexOf(dirname)
    return index
  }

  while (getIndex() > -1) {
    out = out.substr(0, index) + out.substr(index + dirname.length)
  }

  return out
}

/**
 * Replaces output rubbish like `[8m [10m`.
 * @ignore
 */
export const fixEncoding: IStringHandler = (out: string) => out.replace(/\[\d*m?/g, '')

/**
 * Removes redundant spaces from both ends of strings.
 * @ignore
 */
export const trim: IStringHandler = (str: string) => str.trim()

/**
 * Converts tabs to double spaces.
 * @ignore
 */
export const tabsToSpaces: IStringHandler = (str: string) => str.replace(/\t/gi, '  ')
