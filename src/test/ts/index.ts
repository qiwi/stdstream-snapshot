import {readFileSync} from 'fs'

import {generateSnapshot, matchSnapshot} from '../../main/ts'

describe('stdstream-snapshot', () => {
  const target = 'src/test/snapshots/foo.json'
  const dirname = process.cwd()
  const stdout = `
\t${dirname}/rules/some-rules.ts
\t\t2:7   error  'name' is assigned a value but never used                                 no-unused-vars
\t\t3:7   error  'name' is already defined                                                 no-redeclare


`
  const cmd = `echo "${stdout}" && exit 1`
  const normalizedStdout = `/rules/some-rules.ts
    2:7   error  'name' is assigned a value but never used                                 no-unused-vars
    3:7   error  'name' is already defined                                                 no-redeclare`

  describe('#generateSnapshot', () => {
    it('returns a new snapshot', async() => {
      const snapshot = await generateSnapshot({
        cmd,
      })

      expect(snapshot).toMatchSnapshot()
    })
  })

  describe('#matchSnapshot', () => {

    it('requires target option', () => {
      return expect(matchSnapshot({
        cmd,
      }))
        .rejects
        .toEqual(new Error('stdstream-snapshot: matchSnapshot requires target'))
    })

    it('updates snapshot data with new stdout', async() => {
      const result = await matchSnapshot({
        cmd,
        target,
        update: true,
        cmdOpts: {cwd: dirname},
      })
      expect(result).toBeTruthy()
      const {stdout, err} = JSON.parse(readFileSync(target, 'utf-8'))

      expect(stdout).toBe(normalizedStdout)
      expect(err.code).toBe(1)
    })

    it('return true if new snapshot matches to the previous', async() => {
      const result = await matchSnapshot({
        cmd,
        target,
        cmdOpts: {cwd: dirname},
      })

      expect(result).toBeTruthy()
    })

    it('return false otherwise', async() => {
      const result = await matchSnapshot({
        cmd: 'echo baz quux',
        target,
        cmdOpts: {cwd: dirname},
      })

      expect(result).toBeFalsy()
    })
  })
})
