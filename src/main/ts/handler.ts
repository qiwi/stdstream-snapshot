import {IStringHandler} from './interface'

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

export const fixEncoding: IStringHandler = (out: string) => out.replace(/\[\d*m?/g, '')

export const trim: IStringHandler = (str: string) => str.trim()

export const tabsToSpaces: IStringHandler = (str: string) => str.replace(/\t/gi, '  ')
