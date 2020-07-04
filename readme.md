# n-readline

[![Build Status](https://travis-ci.org/AlexanderMac/n-readline.svg?branch=master)](https://travis-ci.org/AlexanderMac/n-readline)
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
const NReadline = require('n-readline');

let rl = new NReadline({
  filepath: './example.txt',
  start: 100,
  limit: 50,
  skipEmptyLines: true
});

rl.start();
rl.on('error', err => console.log('Error', err));
rl.on('line', (line, lineNumber) => {
  // on line 110, pause reader for 100ms
  if (lineNumber === 109) {
    rl.pause();
    setTimeout(() => rl.resume(), 100);
  // on line 120, close reader
  } else if (lineNumber === 119) {
    rl.close();
  }
  console.log(line, lineNumber)
});
rl.on('end', () => console.log('Done'));
```

## API
TODO

## Author
Alexander Mac

## Licence
Licensed under the MIT license.
