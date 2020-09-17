import Substance from '@/gameObjects/Substance'
import RandomWalkModule from '@/gameObjects/RandomWalkModule'
import animationModules from '@/gameObjects/animationModules'
import TweetBubble from '@/class/TweetBubble'
import assets from 'assets'
const angleRadian = {
  down: Math.PI / 2,
  left: Math.PI,
  right: 0,
  up: Math.PI / -2
}
const getAnimationModule = spriteKey => {
  const frameLength = assets.spritesheet.find(v => v[0] === spriteKey)[2].endFrame + 1
  switch (frameLength) {
    case 12: return animationModules.Character
    case 3: return animationModules.Boss
  }
}
export default class Character extends Substance {
  constructor (scene, x, y, key, option) {
    super(scene, x, y, key, option)
    this.setTarget(null)
    this.setSpeed(40)
    this.setR('down')
    this.setFaceKey(this.key)
    this.setTalking(false)
    this.tweetBubble = new TweetBubble(scene).setDepth(210000)
  }
  preUpdate () {
    super.preUpdate()
    if (this.target) this.updateTargetPositionToTarget()
    this.walkToTargetPosition()
    this._calcRotation()
    if (this.randomWalkModule) this.randomWalkModule.update()
    this._collideWall()
    this.tweetBubble.setPosition(this.x, this.y - 60)
    this.updateAnim()
  }
  initImage (key, width, height) {
    super.initImage(key, width, height)
    const AnimationModule = getAnimationModule(this.spriteKey)
    this.animationModule = AnimationModule && new AnimationModule(this.scene, this.image)
    return this
  }
  updateAnim () {
    if (this.animationModule) this.animationModule.update(this.r, this.velocity)
  }
  setDisplayName (name) {
    this.displayName = name
    return this
  }
  setFaceKey (name) {
    this.faceKey = name
    return this
  }
  setTarget (target = null, leave = false) {
    this.target = target
    this.leaveFromTarget = leave
    return this
  }
  setTargetPosition (x = null, y = null) {
    this.targetPositionX = x
    this.targetPositionY = y
    if (this.targetPositionResolver) this.targetPositionResolver()
    return new Promise(resolve => {
      this.targetPositionResolver = resolve
    })
  }
  stopWalk (immediately = false) {
    this.targetPositionX = null
    this.targetPositionY = null
    if (immediately) this.body.setVelocity(0, 0)
    if (this.targetPositionResolver) this.targetPositionResolver()
    return this
  }
  setSpeed (speed = 120) {
    this.speed = speed
    return this
  }
  getBalloon () {
    return super.getBalloon('bubble_talk')
  }
  tweet (text) {
    return new Promise(resolve => {
      this.tweetBubble.setText(text, resolve)
    })
  }
  get hasTargetPosition () {
    return this.targetPositionX !== null && this.targetPositionY !== null
  }
  get diffToTargetPositionX () {
    return this.hasTargetPosition ? this.targetPositionX - this.x : 0
  }
  get diffToTargetPositionY () {
    return this.hasTargetPosition ? this.targetPositionY - this.y : 0
  }
  get diffToTargetPositionDistance () {
    return Math.hypot(this.diffToTargetPositionX, this.diffToTargetPositionY)
  }
  get velocity () {
    return Math.hypot(this.body.velocity.x, this.body.velocity.y)
  }
  get walking () {
    return this.velocity > 1
  }
  _calcRotation () {
    if (!this.walking) return
    this.r = Math.atan2(this.body.velocity.y, this.body.velocity.x)
  }
  updateTargetPositionToTarget () {
    const diffToTargetX = this.target.x - this.x
    const diffToTargetY = this.target.y - this.y
    const distance = Math.hypot(diffToTargetX, diffToTargetY)
    if (this.leaveFromTarget ? distance > 200 : distance < 50 || distance > 400) return this.stopWalk()
    const x = this.leaveFromTarget ? this.x - diffToTargetX : this.target.x
    const y = this.leaveFromTarget ? this.y - diffToTargetY : this.target.y
    this.setTargetPosition(x, y)
  }
  walkToTargetPosition () {
    if (!this.hasTargetPosition) return
    const diffX = this.diffToTargetPositionX
    const diffY = this.diffToTargetPositionY
    const x = (!this.body.blocked.left && !this.body.blocked.right) ? diffX : diffX * 0.1
    const y = (!this.body.blocked.top && !this.body.blocked.down) ? diffY : diffY * 0.1
    this.body.setVelocity(x, y)
    const speed = Math.min(this.speed, this.diffToTargetPositionDistance * 10)
    this.body.velocity.normalize().scale(speed)
    if (this.diffToTargetPositionDistance < 5) this.stopWalk()
  }
  setR (value) {
    this.r = typeof value === 'string' ? angleRadian[value] : value
    this.updateAnim()
    return this
  }
  setRandomWalk (bool, { speed, range = 50 } = {}) {
    this.randomWalkModule = bool ? new RandomWalkModule(this.scene, this, range) : null
    if (speed) this.setSpeed(speed)
    return this
  }
  setTalking (bool) {
    this.talking = bool
    if (bool) this.stopWalk()
    return this
  }
  _collideWall () {
    if (this.walking) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, this.lastX, this.lastY)
      if (distance > 0 && distance < 0.15) this.stopWalk()
    }
    this.lastX = this.x
    this.lastY = this.y
  }
  die () {
    return new Promise(resolve => {
      this.image.setTint(0xFF0000)
      this.scene.add.tween({
        targets: this, duration: 500, ease: 'Power2',
        scaleX: 1.3, scaleY: 1.3, alpha: 0.2,
        onComplete: () => {
          this.destroy()
          resolve()
        }
      })
    })
  }
}
