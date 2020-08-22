const MAX_DISTANCE = 50
export default class VirtualStick extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y)
    this.scene = scene
    scene.add.existing(this)
    this.stick = null
    this.radian = 0
    this.velocity = 0
    this.velocityX = 0
    this.velocityY = 0
    const padArea = this.scene.add.circle(0, 0, 80, 0x000000, 0.5).setInteractive()
    const pad = this.scene.add.circle(0, 0, 30, 0xFFFFFF, 0.25)
    this.add([padArea, pad])
    padArea.on('pointerdown', pointer => {
      this.stick = pointer
    })
    scene.input.on('pointermove', pointer => {
      if (this.stick === pointer) {
        const distance = Math.min(Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.x, pointer.y), MAX_DISTANCE)
        const r = Math.atan2(pointer.y - pointer.downY, pointer.x - pointer.downX)
        const moveX = Math.cos(r) * distance
        const moveY = Math.sin(r) * distance
        pad.setPosition(moveX, moveY)
        this.radian = r
        this.velocity = distance / MAX_DISTANCE
        this.velocityX = moveX / MAX_DISTANCE
        this.velocityY = moveY / MAX_DISTANCE
      }
    })
    scene.input.on('pointerup', pointer => {
      if (this.stick === pointer) {
        this.stick = null
        this.velocity = 0
        this.velocityX = 0
        this.velocityY = 0
        pad.setPosition(0, 0)
      }
    })
  }
}
