export default class {
  constructor (scene) {
    this.scene = scene
    this.seVolume = 100
    this.bgmVolume = 100
    this.currentBgm = null
  }
  // SE
  setSeVolume (value) {
    this.seVolume = Math.fix(value, 0, 100)
    return this
  }
  se (name) {
    this.scene.sound.play(`se/${name}`, { volume: this.seVolume })
  }
  // BGM
  setBgmVolume (value) {
    this.bgmVolume = Math.fix(value, 0, 100)
    // Update volume for existing BGM
    this.scene.sound.sounds.filter(sound => sound.key.startsWith('bgm')).forEach(bgm => {
      bgm.volume = this.bgmVolume
    })
    return this
  }
  setBgm (name) {
    if (!name) {
      this.currentBgm = null
      this.scene.sound.stopAll()
      return
    }
    const key = `bgm/${name}`
    if (this.currentBgm && this.currentBgm.key === key) return
    if (this.currentBgm) this.currentBgm.stop()
    this.currentBgm = this.scene.sound.add(key, { loop: true, volume: this.bgmVolume })
    this.currentBgm.play()
  }
  interruptBgm (name) {
    const key = `bgm/${name}`
    if (this.currentBgm) {
      if (this.currentBgm.key === key) return () => null
      this.currentBgm.pause()
    }
    const bgm = this.scene.sound.add(key, { loop: true, volume: this.bgmVolume, duration: 200 })
    bgm.play()
    const resolve = () => {
      if (this.currentBgm) {
        this.currentBgm.resume()
        this.currentBgm.setVolume(0)
        this.scene.add.tween({ targets: this.currentBgm, volume: this.bgmVolume, duration: 2000 })
      }
      this.scene.add.tween({
        targets: bgm,
        volume: 0,
        duration: 500,
        onComplete: () => {
          if (bgm.isPlaying) bgm.stop()
        }
      })
    }
    return resolve
  }
}
