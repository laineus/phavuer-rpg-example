export default class FollowModule {
  constructor (chara) {
    this.chara = chara
    this.body = chara.body
  }
  update () {
    if (this.target) this.updateTargetPositionToTarget()
    this.walkToTargetPosition()
  }
  setTarget (target = null, leave = false) {
    this.target = target
    this.leave = leave
    return this
  }
  setTargetPosition (x, y) {
    this.targetPositionX = x
    this.targetPositionY = y
    if (this.targetPositionResolver) this.targetPositionResolver()
    return new Promise(resolve => {
      this.targetPositionResolver = resolve
    })
  }
  clearTargetPosition () {
    this.targetPositionX = null
    this.targetPositionY = null
    if (this.targetPositionResolver) this.targetPositionResolver()
    return this
  }
  get hasTargetPosition () {
    return this.targetPositionX !== null && this.targetPositionY !== null
  }
  get diffToTargetPositionX () {
    return this.hasTargetPosition ? this.targetPositionX - this.chara.x : 0
  }
  get diffToTargetPositionY () {
    return this.hasTargetPosition ? this.targetPositionY - this.chara.y : 0
  }
  get diffToTargetPositionDistance () {
    return Math.hypot(this.diffToTargetPositionX, this.diffToTargetPositionY)
  }
  updateTargetPositionToTarget () {
    const diffToTargetX = this.target.x - this.chara.x
    const diffToTargetY = this.target.y - this.chara.y
    const distance = Math.hypot(diffToTargetX, diffToTargetY)
    if (this.leave ? distance > 200 : distance < 50 || distance > 400) return this.clearTargetPosition()
    const x = this.leave ? this.chara.x - diffToTargetX : this.target.x
    const y = this.leave ? this.chara.y - diffToTargetY : this.target.y
    this.setTargetPosition(x, y)
  }
  walkToTargetPosition () {
    if (!this.hasTargetPosition) return
    const diffX = this.diffToTargetPositionX
    const diffY = this.diffToTargetPositionY
    const x = (!this.body.blocked.left && !this.body.blocked.right) ? diffX : diffX * 0.1
    const y = (!this.body.blocked.top && !this.body.blocked.down) ? diffY : diffY * 0.1
    this.body.setVelocity(x, y)
    const speed = Math.min(this.chara.speed, this.diffToTargetPositionDistance * 10)
    this.body.velocity.normalize().scale(speed)
    if (this.diffToTargetPositionDistance < 5) this.clearTargetPosition()
  }
}
