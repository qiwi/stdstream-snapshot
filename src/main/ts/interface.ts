export type IAnyMap = {
  [key: string]: any
}

export type ICmdOpts = IAnyMap

export type IOpts = {
  cmd: string
  target: string
  cmdOpts?: ICmdOpts,
  update?: boolean,
  normalizePaths?: boolean,
  normalizeEncoding?: boolean,
  trim?: boolean,
  [key: string]: any
}

export type ISnapshot = {
  stdout: string,
  stderr: string,
  opts: IOpts
}

export type IStringHandler = (v: string, ...args: any[]) => string
