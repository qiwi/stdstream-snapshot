// TODO use execa
import {exec, ExecException} from 'child_process'
import {writeFile, readFile} from 'fs'
import {identity, get, pick} from './util'
import {
  trim,
  tabsToSpaces,
  relatify,
  fixEncoding,
} from './handler'

import {
  IAnyMap,
  IOpts,
  ICmdOpts,
  ISnapshot,
  IStringHandler,
  IErr,
} from './interface'

export const DEFAULT_OPTS = {
  trim: true,
  normalizeSpaces: true,
  normalizePaths: true,
  normalizeEncoding: true,
}

export const DEFAULT_CMD_OPTS: ICmdOpts = {cwd: __dirname}

export const processCmdOpts = (opts: ICmdOpts = {}): ICmdOpts => ({...DEFAULT_CMD_OPTS, opts})

export const getExecSnapshot = async(opts: IOpts): Promise<ISnapshot> => new Promise((resolve) => {
  const {cmd, cmdOpts} = opts
  const _cmdOpts: any = processCmdOpts(cmdOpts)

  exec(cmd, _cmdOpts, (_err: ExecException | null, _stdout: string | Buffer, _stderr: string | Buffer) => {
    const stdout = _stdout + ''
    const stderr = _stderr + ''
    const err: IErr = {
      signal: null,
      code: 0,
      killed: false,
      ...pick(_err, 'signal', 'code', 'killed'),
    }

    resolve({
      stdout,
      stderr,
      err,
    })
  })
})

export const getSnapshot = async(filePath: string): Promise<ISnapshot> => new Promise((resolve, reject) => {
  readFile(filePath, 'utf8', (err, result) => {
    if (err) {
      reject(err)
    }
    else {
      resolve(JSON.parse(result) as ISnapshot)
    }
  })
})

export const updateSnapshot = (filePath: string, snapshot: ISnapshot): Promise<any> => new Promise((resolve, reject) => {
  const text = JSON.stringify(snapshot)

  writeFile(filePath, text, (err) => {
    if (err) {
      reject(err)
    }
    else {
      resolve(text)
    }
  })
})

export const normalizeSnapshot = (snapshot: ISnapshot, opts: IOpts): ISnapshot => {
  // const opts: IOpts = snapshot.opts
  const handlerMap: {[key: string]: IStringHandler} = {
    normalizePaths: relatify,
    normalizeEncoding: fixEncoding,
    normalizeSpaces: tabsToSpaces,
    trim,
  }
  const handlerOptsMap: IAnyMap = {
    normalizePaths: [get(opts, 'cmdOpts.cwd')],
  }

  return Object.keys(opts).reduce((m: ISnapshot, k: string) => {
    const v = opts[k]
    const handler: IStringHandler = (v && handlerMap[k]) || identity
    const handlerOpts: Array<any> = handlerOptsMap[k] || []

    return applyHandler(handler, m, ...handlerOpts)
  }, snapshot)
}

export const applyHandler = (handler: IStringHandler, snapshot: ISnapshot, ..._opts: any[]) => {
  const {stdout, stderr, err} = snapshot

  return {
    stderr: handler(stderr, ..._opts),
    stdout: handler(stdout, ..._opts),
    err,
  }
}

export const matchSnapshot = async(opts: IOpts): Promise<boolean> => {
  const _opts: IOpts = {...DEFAULT_OPTS, ...opts}
  const {target, update} = _opts
  const execSnapshot: ISnapshot = await getExecSnapshot(_opts)
  const snapshot: ISnapshot = normalizeSnapshot(execSnapshot, _opts)

  if (update) {
    await updateSnapshot(target, snapshot)
    return true
  }

  const prevSnapshot = await getSnapshot(target)

  return match(snapshot, prevSnapshot)
}

export const match = (prev: ISnapshot, next: ISnapshot): boolean =>
  prev.stdout === next.stdout
    && prev.stderr === next.stderr
