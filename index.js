const fs = require('fs')
const path = require('path')
const events = require('events')

class NReadline extends events.EventEmitter {
  constructor({ filepath, encoding = 'utf8', start, limit, skipEmptyLines }) {
    super()
    this._readStream = null
    this._filepath = path.normalize(filepath)
    this._streamOptions = { encoding }
    this._skipEmptyLines = !!skipEmptyLines

    this._from = start || 0
    if (limit) {
      this._to = this._from + limit
    }
    this._lines = []
    this._lineFragment = ''
    this._lineNumber = 0
    this._isPaused = false
    this._isStopping = false
    this._isStopped = false
  }

  start() {
    setImmediate(() => this._initStream())
  }

  pause() {
    this._isPaused = true
  }

  resume() {
    this._isPaused = false
    setImmediate(() => this._nextLine())
  }

  stop() {
    this._readStream.destroy()
    this._isStopping = true
    this._lines = []
    setImmediate(() => this._stop())
  }

  _initStream() {
    this._readStream = fs.createReadStream(this._filepath, this._streamOptions)

    this._readStream.on('error', err => {
      this.emit('error', err)
    })

    this._readStream.on('open', () => {
      this.emit('open')
    })

    this._readStream.on('data', (data) => {
      this._readStream.pause()
      var dataAsString = data
      this._lines = this._lines.concat(dataAsString.split(/(?:\n|\r\n|\r)/g))

      this._lines[0] = this._lineFragment + this._lines[0]
      this._lineFragment = this._lines.pop() || ''

      setImmediate(() => this._nextLine())
    })

    this._readStream.on('end', () => {
      this._isStopping = true
      setImmediate(() => this._nextLine())
    })
  }

  _nextLine() {
    if (this._isPausedOrFinished()) {
      return
    }
    if (this._handleFrom()) {
      return
    }
    if (this._handleTo()) {
      return
    }
    if (this._handleEmptyLinesBuffer()) {
      return
    }

    let line = this._lines.shift()
    if (!this._skipEmptyLines || line.length > 0) {
      this.emit('line', line, this._lineNumber)
    }

    this._lineNumber++
    setImmediate(() => this._nextLine())
  }

  _stop() {
    if (!this._isStopped) {
      this._isStopped = true
      this.emit('end')
    }
  }

  _isPausedOrFinished() {
    return this._isPaused || this._isStopped
  }

  _handleFrom() {
    if (!this._from || this._lineNumber >= this._from) {
      return
    }
    if (this._lines.length === 0) {
      if (this._isStopping) {
        this._stop()
      } else {
        this._readStream.resume()
      }
    } else {
      this._lines.shift()
      this._lineNumber++
      setImmediate(() => this._nextLine())
    }
    return true
  }

  _handleTo() {
    if (!this._to || this._lineNumber < this._to) {
      return
    }
    this._isStopping = true
    this._stop()
    return true
  }

  _handleEmptyLinesBuffer() {
    if (this._lines.length !== 0) {
      return
    }
    if (this._isStopping) {
      if (this._lineFragment) {
        this.emit('line', this._lineFragment, this._lineNumber)
        this._lineFragment = ''
      }
      this._stop()
    } else {
      this._readStream.resume()
    }
    return true
  }
}

module.exports = NReadline
