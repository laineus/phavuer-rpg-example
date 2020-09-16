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
  constructor (scene, key, image) {
    this.scene = scene
    this.key = key
    this.image = image
  }
  registerAnim (options) {
    if (this.scene.anims.exists(options.key)) return
    this.scene.anims.create(Object.assign({ repeat: -1, yoyo: true }, options))
  }
}
export default {
  Character: class extends AnimationModule {
    constructor (scene, key, image) {
      super(scene, key, image)
      this.registerAnim({ key: `${key}_walk_down`, frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 2 }), frameRate: 5 })
      this.registerAnim({ key: `${key}_walk_left`, frames: scene.anims.generateFrameNumbers(key, { start: 3, end: 5 }), frameRate: 5 })
      this.registerAnim({ key: `${key}_walk_right`, frames: scene.anims.generateFrameNumbers(key, { start: 6, end: 8 }), frameRate: 5 })
      this.registerAnim({ key: `${key}_walk_up`, frames: scene.anims.generateFrameNumbers(key, { start: 9, end: 11 }), frameRate: 5 })
      this.angleFrame = { down: 1, left: 4, right: 7, up: 10 }
    }
    update (r, velocity) {
      if (velocity > 1) {
        this.image.anims.play(`${this.key}_walk_${angleKey(r)}`, true)
      } else {
        this.image.setFrame(this.angleFrame[angleKey(r)])
      }
    }
  },
  Boss: class extends AnimationModule {
    constructor (scene, key, image) {
      super(scene, key, image)
      this.registerAnim({ key: `${key}_waiting`, frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 2 }), frameRate: 4 })
    }
    update () {
      this.image.anims.play(`${this.key}_waiting`, true)
    }
  }
}
