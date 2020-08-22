export default class {
  constructor (keyboard) {
    keyboard.addCapture('W,S,A,D')
    this.wasd = [
      { key: keyboard.addKey('W'), x: 0, y: -1 },
      { key: keyboard.addKey('A'), x: -1, y: 0 },
      { key: keyboard.addKey('S'), x: 0, y: 1 },
      { key: keyboard.addKey('D'), x: 1, y: 0 }
    ]
  }
  get velocity () {
    return this.wasd.filter(v => v.key.isDown).reduce((position, v) => {
      position.x += v.x
      position.y += v.y
      return position
    }, { x: 0, y: 0 })
  }
  get velocityX () {
    return this.velocity.x
  }
  get velocityY () {
    return this.velocity.y
  }
}
