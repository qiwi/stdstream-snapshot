# stdstream-snapshot
Tiny util for CLI testing: fetch stdout, stderr streams and match data to snapshot

## Install
```bash
yarn add stdstream-snapshot -D
npm add stdstream-snapshot -D
```

## Usage
```javascript
import {match} from 'stdstream-snapshot'

it('cmd output matches to spapshot', () => {
  const cmd = 'somecmd --flag=foo -b'
  const path = './test/snapshots/some-cmd-output.json'  
  
  expect(match({
    cmd,
    path,
    update: true
  })).toBeTruthy()
})
```
