const angleKey = r => {
  const x = Math.cos(r)
  const y = Math.sin(r)
  if (Math.abs(x) > Math.abs(y)) {
    return x < 0 ? 'left' : 'right'
  } else {
    return y < 0 ? 'up' : 'down'
  }
}
class AnimationModule {
  constructor (scene, image) {
    this.scene = scene
    this.image = image
    this.key = image.texture.key
  }
  registerAnim (options) {
    if (this.scene.anims.exists(options.key)) return
    this.scene.anims.create(Object.assign({ repeat: -1, yoyo: true }, options))
  }
}
export default {
  Character: class extends AnimationModule {
    constructor (scene, image) {
      super(scene, image)
      this.registerAnim({ key: `${this.key}/walk/down`, frames: scene.anims.generateFrameNumbers(this.key, { start: 0, end: 2 }), frameRate: 5 })
      this.registerAnim({ key: `${this.key}/walk/left`, frames: scene.anims.generateFrameNumbers(this.key, { start: 3, end: 5 }), frameRate: 5 })
      this.registerAnim({ key: `${this.key}/walk/right`, frames: scene.anims.generateFrameNumbers(this.key, { start: 6, end: 8 }), frameRate: 5 })
      this.registerAnim({ key: `${this.key}/walk/up`, frames: scene.anims.generateFrameNumbers(this.key, { start: 9, end: 11 }), frameRate: 5 })
      this.angleFrame = { down: 1, left: 4, right: 7, up: 10 }
    }
    update (r, velocity) {
      if (velocity > 1) {
        this.image.anims.play(`${this.key}/walk/${angleKey(r)}`, true)
      } else {
        this.image.setFrame(this.angleFrame[angleKey(r)])
      }
    }
  },
  Boss: class extends AnimationModule {
    constructor (scene, image) {
      super(scene, image)
      this.registerAnim({ key: `${this.key}/waiting`, frames: scene.anims.generateFrameNumbers(this.key, { start: 0, end: 2 }), frameRate: 4 })
    }
    update () {
      this.image.anims.play(`${this.key}/waiting`, true)
    }
  }
}
