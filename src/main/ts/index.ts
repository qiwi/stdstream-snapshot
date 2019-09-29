/** @module stdstream-snapshot */

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

/**
 * @ignore
 */
export const DEFAULT_CMD_OPTS: ICmdOpts = {cwd: process.cwd()}

/**
 * Default options.
 */
export const DEFAULT_OPTS = {
  trim: true,
  normalizeSpaces: true,
  normalizePaths: true,
  normalizeEncoding: true,
  cmdOpts: DEFAULT_CMD_OPTS,
}

/**
 * Executes the cmd and returns std stream data as a result.
 * @param {IOpts} opts
 * @return {Promise<ISnapshot>} snapshot
 */
export const getExecSnapshot = async(opts: IOpts): Promise<ISnapshot> => new Promise((resolve) => {
  const {cmd, cmdOpts} = opts

  exec(cmd, cmdOpts as any, (_err: ExecException | null, _stdout: string | Buffer, _stderr: string | Buffer) => {
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

/**
 * Reads the snapshot from file.
 * @ignore
 * @param {string} filePath
 * @return {ISnapshot} snapshot
 */
export const readSnapshot = async(filePath: string): Promise<ISnapshot> => new Promise((resolve, reject) => {
  readFile(filePath, 'utf8', (err, result) => {
    if (err) {
      reject(err)
    }
    else {
      resolve(JSON.parse(result) as ISnapshot)
    }
  })
})

/**
 * Executes the cmd and returns normalized std stream data as a result.
 * @param {IOpts} opts
 * @return {Promise<ISnapshot>} snapshot
 */
export const generateSnapshot = async(opts: IOpts): Promise<ISnapshot> => {
  const _opts: IOpts = {...DEFAULT_OPTS, ...opts}
  const execSnapshot: ISnapshot = await getExecSnapshot(_opts)

  return normalizeSnapshot(execSnapshot, _opts)
}

/**
 * Writes snapshot data to a file.
 * @ignore
 * @param {string} filePath
 * @param {ISnapshot} snapshot
 */
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

/**
 * Normalized snapshot data.
 * @ignore
 * @param {ISnapshot} snapshot
 * @param {IOpts} opts
 */
export const normalizeSnapshot = (snapshot: ISnapshot, opts: IOpts): ISnapshot => {
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

/**
 * Applies StringHandler to snapshot.
 * @ignore
 * @param handler
 * @param snapshot
 * @param _opts
 */
export const applyHandler = (handler: IStringHandler, snapshot: ISnapshot, ..._opts: any[]) => {
  const {stdout, stderr, err} = snapshot

  return {
    stderr: handler(stderr, ..._opts),
    stdout: handler(stdout, ..._opts),
    err,
  }
}

/**
 * Executes cmd and matches its stdout/stderr to the previous snapshot.
 * @param {IOpts} opts
 * @return {Promise<Boolean>} result
 */
export const matchSnapshot = async(opts: IOpts): Promise<boolean> => {
  const {target, update} = opts

  if (!target) {
    throw new Error('stdstream-snapshot: matchSnapshot requires target')
  }

  const snapshot: ISnapshot = await generateSnapshot(opts)

  if (update) {
    await updateSnapshot(target, snapshot)
    return true
  }

  const prevSnapshot = await readSnapshot(target)

  return match(snapshot, prevSnapshot)
}

/**
 * Snapshot matcher.
 * @ignore
 * @param {ISnapshot} prev
 * @param {ISnapshot} next
 */
export const match = (prev: ISnapshot, next: ISnapshot): boolean =>
  prev.stdout === next.stdout
    && prev.stderr === next.stderr
      && JSON.stringify(prev.err) === JSON.stringify(next.err)
