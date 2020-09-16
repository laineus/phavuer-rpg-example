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
    this._walkToTargetPosition()
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
    this.unsetFollowing()
    this.target = target
    this.leaveFromTarget = leave
    return this
  }
  setTargetPosition (x = null, y = null) {
    this.unsetFollowing()
    this._targetPositionX = x
    this._targetPositionY = y
    if (this._targetPositionResolve) this._targetPositionResolve()
    return new Promise(resolve => {
      this._targetPositionResolve = resolve
    })
  }
  unsetFollowing () {
    // this.target = null
    this._targetPositionX = null
    this._targetPositionY = null
  }
  stopWalk () {
    this.unsetFollowing()
    this.body.setVelocity(0, 0)
    return this
  }
  setSpeed (speed = 120) {
    this.speed = speed
    return this
  }
  setVelocity (x, y) {
    this.unsetFollowing()
    this.body.setVelocity(x, y)
    this.body.velocity.normalize().scale(this.speed)
  }
  getBalloon () {
    return super.getBalloon('bubble_talk')
  }
  tweet (text) {
    return new Promise(resolve => {
      this.tweetBubble.setText(text, resolve)
    })
  }
  get hasTarget () {
    return this.target !== null
  }
  get hasTargetPosition () {
    return this._targetPositionX !== null && this._targetPositionY !== null
  }
  get followingTarget () {
    return this.hasTargetPosition || this.hasTarget
  }
  get followingX () {
    if (this.hasTargetPosition) return this._targetPositionX
    if (this.hasTarget) return this.target.x
    return null
  }
  get followingY () {
    if (this.hasTargetPosition) return this._targetPositionY
    if (this.hasTarget) return this.target.y
    return null
  }
  get diffToFollowingX () {
    return this.followingTarget ? this.followingX - this.x : 0
  }
  get diffToFollowingY () {
    return this.followingTarget ? this.followingY - this.y : 0
  }
  get diffToFollowingDistance () {
    return Math.hypot(this.diffToFollowingX, this.diffToFollowingY)
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
  _walkToTargetPosition () {
    if (!this.followingTarget) return
    if (this.hasTarget && !this.leaveFromTarget && (this.diffToFollowingDistance < 50 || this.diffToFollowingDistance > 400)) return
    if (this.hasTarget && this.leaveFromTarget && this.diffToFollowingDistance > 200) return
    const diffToFollowingX = (this.hasTarget && this.leaveFromTarget) ? -this.diffToFollowingX : this.diffToFollowingX
    const diffToFollowingY = (this.hasTarget && this.leaveFromTarget) ? -this.diffToFollowingY : this.diffToFollowingY
    const x = (!this.body.blocked.left && !this.body.blocked.right) ? diffToFollowingX : diffToFollowingX * 0.1
    const y = (!this.body.blocked.top && !this.body.blocked.down) ? diffToFollowingY : diffToFollowingY * 0.1
    this.body.setVelocity(x, y)
    const speed = Math.min(this.speed, (this.diffToFollowingDistance * 10))
    this.body.velocity.normalize().scale(speed)
    if (this.diffToFollowingDistance < 5) {
      if (this._targetPositionResolve) {
        this._targetPositionResolve()
        this._targetPositionResolve = null
      }
      this.stopWalk()
    }
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
