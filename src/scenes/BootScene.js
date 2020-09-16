import loadAssets from '@/util/loadAssets'
export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'Boot', active: true })
  }
  create () {
    Phaser.BlendModes.OVERLAY = this.sys.game.renderer.addBlendMode([WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE], WebGLRenderingContext.FUNC_ADD)
    this.scene.start('UI')
    this.scene.start('Game', { map: 'room1', x: 610, y: 340 })
  }
  preload () {
    loadAssets(this)
  }
}
