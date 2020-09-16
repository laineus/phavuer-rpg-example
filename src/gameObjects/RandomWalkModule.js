export default class RandomWalkModule {
  constructor (scene, chara, range) {
    this.scene = scene
    this.chara = chara
    this.radius = Math.round(range / 2)
    this.setNextDelay()
  }
  update () {
    if (this.chara.talking) return
    if (!this.chara.walking || !this.chara.body.blocked.none) this.delay--
    if (this.delay > 0) return
    const pos = this.getRandomPosition()
    if (pos) this.chara.setTargetPosition(pos.x, pos.y)
    this.setNextDelay()
  }
  setNextDelay () {
    this.delay = Math.randomInt(100, 200)
  }
  getRandomPosition (tryCount = 10) {
    if (tryCount === 0) return null
    const x = this.chara.x + Math.randomInt(-this.radius, this.radius)
    const y = this.chara.y + Math.randomInt(-this.radius, this.radius)
    const collides = this.scene.map.isCollides(x.toTile, y.toTile)
    return collides ? this.getRandomPosition(tryCount - 1) : { x, y }
  }
}
