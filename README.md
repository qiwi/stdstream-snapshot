# stdstream-snapshot
Tiny util for CLI testing: fetch stdout, stderr streams and match data to snapshot

## Install
```bash
yarn add stdstream-snapshot -D
npm add stdstream-snapshot -D
```

## Usage
```javascript
import {process} from 'stdstream-snapshot'

it('cmd output matches to spapshot', () => {
  const cmd = 'somecmd --flag=foo -b'
  const target = './test/snapshots/some-cmd-output.json'  
  
  expect(process({
    cmd,
    target,
    update: true
  })).toBeTruthy()
})
```
