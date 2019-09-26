# stdstream-snapshot
[![Build Status](https://travis-ci.com/qiwi/stdstream-snapshot.svg?branch=master)](https://travis-ci.com/qiwi/stdstream-snapshot)
[![npm (tag)](https://img.shields.io/npm/v/stdstream-snapshot/latest.svg)](https://www.npmjs.com/package/stdstream-snapshot)
[![dependencyStatus](https://img.shields.io/david/qiwi/stdstream-snapshot.svg?maxAge=300)](https://david-dm.org/qiwi/stdstream-snapshot)
[![Maintainability](https://api.codeclimate.com/v1/badges/5770053f57f0656df4ea/maintainability)](https://codeclimate.com/github/qiwi/stdstream-snapshot/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5770053f57f0656df4ea/test_coverage)](https://codeclimate.com/github/qiwi/stdstream-snapshot/test_coverage)

Tiny util for CLI testing: fetch stdout, stderr streams and match data to snapshot

## Install
```bash
yarn add stdstream-snapshot -D
npm add stdstream-snapshot -D
```

## Usage
```javascript
import {matchSnapshot} from 'stdstream-snapshot'

it('cmd output matches to spapshot', async () => {
  const cmd = 'somecmd --flag=foo -b'
  const target = './test/snapshots/some-cmd-output.json'
  const result = await matchSnapshot({
    cmd,
    target,
    update: true
  })

  expect(result).toBeTruthy()
})
```
