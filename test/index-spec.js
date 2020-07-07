const should = require('should');
const NReadline = require('../index');

describe('functional tests', () => {
  function _getInstance(xParams) {
    let params = Object.assign({
      filepath: './test/2k-usernames.txt',
      skipEmptyLines: true
    }, xParams);
    return new NReadline(params);
  }

  it('should emit error when file not exists', done => {
    let rl = _getInstance({ filepath: 'not-existing-file' });
    let expected = new Error('ENOENT: no such file or directory, open \'not-existing-file\'');

    rl.start();
    rl.on('error', (err) => {
      should(err.message).eql(expected.message);
      done();
    });
    rl.on('end', done);
  });

  it('should read whole file and skip empty lines when skipEmptyLines is true', done => {
    let rl = _getInstance();
    let expected = 1907;
    let lineCount = 0;

    rl.start();
    rl.on('error', done);
    rl.on('line', () => lineCount++);
    rl.on('end', () => {
      should(lineCount).eql(expected);
      done();
    });
  });

  it('should read whole file and do not skip empty lines when skipEmptyLines is false', done => {
    let rl = _getInstance({ skipEmptyLines: false });
    let expected = 1908;
    let lineCount = 0;

    rl.start();
    rl.on('error', done);
    rl.on('line', () => lineCount++);
    rl.on('end', () => {
      should(lineCount).eql(expected);
      done();
    });
  });

  it('should read first 5 lines and pause, wait for 100ms, resume and read another 5 lines', done => {
    let rl = _getInstance({ limit: 10 });
    let expected = ['0', '01', '02', '03', '1', '10', '11', '12', '13', '14'];
    let lines = [];

    rl.start();
    rl.on('error', done);
    rl.on('line', (line, lineNumber) => {
      if (lineNumber === 4) {
        rl.pause();
        setTimeout(() => rl.resume(), 100);
      }
      lines.push(line);
    });
    rl.on('end', () => {
      should(lines).eql(expected);
      done();
    });
  });

  it('should read first 10 lines and stop', done => {
    let rl = _getInstance();
    let expected = ['0', '01', '02', '03', '1', '10', '11', '12', '13', '14'];
    let lines = [];

    rl.start();
    rl.on('error', done);
    rl.on('line', (line, lineNumber) => {
      if (lineNumber === 9) {
        rl.stop();
      }
      lines.push(line);
    });
    rl.on('end', () => {
      should(lines).eql(expected);
      done();
    });
  });

  it('should read first 10 lines only when limit is 10', done => {
    let rl = _getInstance({ limit: 10 });
    let expectedLines = ['0', '01', '02', '03', '1', '10', '11', '12', '13', '14'];
    let expectedNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let lines = [];
    let lineNumbers = [];

    rl.start();
    rl.on('error', done);
    rl.on('line', (line, lineNumber) => {
      lines.push(line);
      lineNumbers.push(lineNumber);
    });
    rl.on('end', () => {
      should(lines).eql(expectedLines);
      should(lineNumbers).eql(expectedNumbers);
      done();
    });
  });

  it('should read 10 lines starting from 1000 only when start is 999 and limit is 10', done => {
    let rl = _getInstance({ start: 1000, limit: 10 });
    let expectedLines = ['messenger', 'mg', 'mgmt', 'mh', 'mi', 'miami', 'michigan', 'mickey', 'midwest', 'mike'];
    let expectedNumbers = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009];
    let lines = [];
    let lineNumbers = [];

    rl.start();
    rl.on('error', done);
    rl.on('line', (line, lineNumber) => {
      lines.push(line);
      lineNumbers.push(lineNumber);
    });
    rl.on('end', () => {
      should(lines).eql(expectedLines);
      should(lineNumbers).eql(expectedNumbers);
      done();
    });
  });

  it('should correctly stops reader when start is greater than lineCount', done => {
    let rl = _getInstance({ start: 3000 });
    let expectedLines = [];
    let expectedNumbers = [];
    let lines = [];
    let lineNumbers = [];

    rl.start();
    rl.on('error', done);
    rl.on('line', (line, lineNumber) => {
      lines.push(line);
      lineNumbers.push(lineNumber);
    });
    rl.on('end', () => {
      should(lines).eql(expectedLines);
      should(lineNumbers).eql(expectedNumbers);
      done();
    });
  });
});
