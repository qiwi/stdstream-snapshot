# stdstream-snapshot
[![CI](https://github.com/qiwi/stdstream-snapshot/actions/workflows/ci.yaml/badge.svg)](https://github.com/qiwi/stdstream-snapshot/actions/workflows/ci.yaml)
[![Maintainability](https://api.codeclimate.com/v1/badges/5770053f57f0656df4ea/maintainability)](https://codeclimate.com/github/qiwi/stdstream-snapshot/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5770053f57f0656df4ea/test_coverage)](https://codeclimate.com/github/qiwi/stdstream-snapshot/test_coverage)
[![npm (scoped)](https://img.shields.io/npm/v/@qiwi/stdstream-snapshot)](https://www.npmjs.com/package/@qiwi/stdstream-snapshot)


Util for CLI testing: fetch stdout, stderr streams and match its data to snapshot

## Install
```bash
yarn add stdstream-snapshot -D
npm add stdstream-snapshot -D
```

## Snapshot
```json
{
  "stderr": "",
  "stdout": "/rules/some-rules.ts\n    2:7   error  'name'...",
  "err": {
    "signal": null,
    "code": 1,
    "killed": false
  }
}
```

## Usage
With [Jest](https://jestjs.io/):
```javascript
import {generateSnapshot} from 'stdstream-snapshot'

it('cmd output matches to snapshot', async () => {
  const cmd = 'somecmd --flag=foo -b'
  const result = await generateSnapshot({
    cmd,
  })

  expect(result).toMatchSnapshot()
})
```

With [Jasmine](https://jasmine.github.io/) or another one test framework with no built-it snapshot API:
```javascript
import {matchSnapshot} from 'stdstream-snapshot'

it('cmd output matches to snapshot', async () => {
  const cmd = 'somecmd --flag=foo -b'
  const target = './test/snapshots/some-cmd-output.json'
  const result = await matchSnapshot({
    cmd,
    target,
    update: !!process.env.UPDATE_SNAPSHOT
  })

  expect(result).toBe(true)
})
```

## Options
There're several normalization steps supported out of box.

| Option              | Description | Default |
|---------------------|-------------|---------|
| `trim`              | Removes redundant spaces from both ends of strings | true |
| `normalizePaths`    | Replaces `process.cwd()` prefix from any found paths in the output strings | true |
| `normalizeSpaces`   | Converts tabs to double spaces | true |
| `normalizeEncoding` | Replaces output rubbish like `[8m [10m` | true |
