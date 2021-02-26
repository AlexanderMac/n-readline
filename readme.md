# n-readline

[![Build Status](https://github.com/AlexanderMac/n-readline/workflows/CI/badge.svg)](https://github.com/AlexanderMac/n-readline/actions?query=workflow%3ACI)
[![Code Coverage](https://codecov.io/gh/AlexanderMac/n-readline/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderMac/n-readline)
[![npm version](https://badge.fury.io/js/n-readline.svg)](https://badge.fury.io/js/n-readline)

## Features
- Read text files line by line.
- Support for pause/resume operations.
- Skip and limit strings.

## Commands
```sh
npm i n-readline
```

## Usage
```js
const NReadline = require('n-readline')

let rl = new NReadline({
  filepath: './example.txt',
  start: 100,
  limit: 50,
  skipEmptyLines: true
})

rl.start()
rl.on('error', err => console.log('Error', err))
rl.on('line', (line, lineNumber) => {
  // on line 110, pause reader for 100ms
  if (lineNumber === 109) {
    rl.pause()
    setTimeout(() => rl.resume(), 100)
  // on line 120, stop reader
  } else if (lineNumber === 119) {
    rl.stop()
  }
  console.log(line, lineNumber)
})
rl.on('end', () => console.log('Done'))
```

## API

### constructor(params)
Creates instance of `NReadline`.

- `filepath`: the path to the source file.
- `encoding`: text encoding used by a read stream, `utf8` by default.
- `start`: the first string number to read, zero based.
- `limit`: the count of strings to read.
- `skipEmptyLines`: if true, skips empty lines, otherwise not, `false` by default.

### start(): void
Starts reader.

### pause: void
Pauses reader.

### resume: void
Resumes reader.

### stop: void
Stops reader.

### on(event: string; handler: () => {})
Event handler.

- `error`: emitted in the case of any error, parameter `err`.
- `line`: emitted when a next string is read, parameters `line` and `lineNumber`.
- `end`: emitted when the whole file is read or `stop` was called.

## Author
Alexander Mac

## Licence
Licensed under the MIT license.
