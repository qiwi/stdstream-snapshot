export type IAnyMap = {
  [key: string]: any
}

export type ICmdOpts = IAnyMap

export type IOpts = {
  cmd: string
  target?: string
  cmdOpts?: ICmdOpts,
  update?: boolean,
  normalizeSpaces: boolean,
  normalizePaths?: boolean,
  normalizeEncoding?: boolean,
  trim?: boolean,
  [key: string]: any
}

export type IErr = {
  killed: boolean,
  code: number,
  signal: any
}

export type ISnapshot = {
  stdout: string,
  stderr: string,
  err: IErr
}

export type IStringHandler = (v: string, ...args: any[]) => string
