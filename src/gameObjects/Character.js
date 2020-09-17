import Substance from '@/gameObjects/Substance'
import TargetWalkModule from '@/gameObjects/TargetWalkModule'
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
    this.setSpeed(40)
    this.setR('down')
    this.setFaceKey(this.key)
    this.setTalking(false)
    this.tweetBubble = new TweetBubble(scene).setDepth(210000)
    this.targetWalkModule = new TargetWalkModule(this)
  }
  preUpdate () {
    super.preUpdate()
    this.targetWalkModule.update()
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
  setTarget (target, leave) {
    this.targetWalkModule.setTarget(target, leave)
    return this
  }
  setTargetPosition (x, y) {
    return this.targetWalkModule.setTargetPosition(x, y)
  }
  stopWalk (immediately = false) {
    this.targetWalkModule.clearTargetPosition()
    if (immediately) this.body.setVelocity(0, 0)
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
  setR (value) {
    this.r = typeof value === 'string' ? angleRadian[value] : value
    this.updateAnim()
    return this
  }
  setRandomWalk (bool, { range = 50 } = {}) {
    this.randomWalkModule = bool ? new RandomWalkModule(this.scene, this, range) : null
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
