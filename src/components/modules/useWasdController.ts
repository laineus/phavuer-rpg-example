import { Math } from 'phaser'
export default (keyboard: Phaser.Input.Keyboard.KeyboardPlugin) => {
  keyboard.addCapture('W,S,A,D')
  const wasd = [
    { key: keyboard.addKey('W'), x: 0, y: -1 },
    { key: keyboard.addKey('A'), x: -1, y: 0 },
    { key: keyboard.addKey('S'), x: 0, y: 1 },
    { key: keyboard.addKey('D'), x: 1, y: 0 }
  ]
  const getVelocity = () => {
    const raw = wasd.filter(v => v.key.isDown).reduce((position, v) => {
      position.x += v.x
      position.y += v.y
      return position
    }, { x: 0, y: 0 })
    const vec = new Math.Vector2(raw.x, raw.y)
    if (vec.length() > 0) vec.normalize()
    return vec
  }
  return {
    getVelocity
  }
}
