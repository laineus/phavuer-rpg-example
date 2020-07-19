import Character from './Character'
export default class Friend extends Character {
  constructor (scene, x, y, key, option) {
    super(scene, x, y, key, option)
    this.setTarget(scene.player)
    this.setFollowDiff(20)
    this.player = scene.player
    this.body.setDrag(700)
    this.setAllowWalkingWhileEvent(false)
  }
  _walkToTargetPosition () {
    if (this.scene.ui.eventMode && !this.allowWalkingWhileEvent) return
    super._walkToTargetPosition()
  }
  setFollowDiff (v) {
    this.followDiff = v
    return this
  }
  setAllowWalkingWhileEvent (bool) {
    this.allowWalkingWhileEvent = bool
    return this
  }
  get followingX () {
    if (this.hasTargetPosition) return this._targetPositionX
    return this.player.positionHistory[this.followDiff][0]
  }
  get followingY () {
    if (this.hasTargetPosition) return this._targetPositionY
    return this.player.positionHistory[this.followDiff][1]
  }
}
