import moment from 'moment'
import config from '@/data/config'
import storage from '@/data/storage'
import setting from '@/data/setting'
import { fadeIn, fadeOut } from '@/util/animations'
import downloadBySource from '@/util/downloadBySource'
import Talk from '@/class/Talk'
import Menu from '@/class/Menu'
import Controller from '@/class/Controller'
import AudioController from '@/class/AudioController'
const SPEED = {
  fast: 200,
  normal: 500,
  slow: 1000
}
export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UI', active: false })
  }
  create (payload = {}) {
    this.storage = storage
    this.setting = setting
    this.audio = new AudioController(this).setSeVolume(setting.state.se).setBgmVolume(setting.state.bgm)
    this.controller = new Controller(this)
    // this.input.keyboard.on('keydown_S', this.snapShot.bind(this))
    // this.menuButton = this.getMenuButton((70).byRight, (35).byBottom)
    // this.add.existing(this.menuButton)
    this.blocker = this.add.rectangle(0, 0, config.WIDTH, config.HEIGHT).setInteractive().setOrigin(0, 0).setVisible(false)
    this.add.existing(this.blocker)
    this.checkButton = this.getCheckButton().setVisible(false)
    this.eventMode = false
  }
  update (time, delta) {
    const sec = Math.floor(time / 1000)
    if (this.sec !== sec) {
      this.sec = sec
      this.storage.state.sec += 1
    }
    this.checkButton.setVisible(this.controllable && this.touchMode && this.gameScene.nearestCheckable)
    if (this.gameScene.nearestCheckable) {
      this.checkButton.icon.setFrame(this.gameScene.nearestCheckable.balloon.key === 'bubble_talk' ? 0 : 1)
    }
  }
  get gameScene () {
    return this.scene.get('Game')
  }
  get controllable () {
    return !this.eventMode && this.scene.isActive('Game')
  }
  get touchMode () {
    switch (this.setting.state.controller) {
      case 0: return !this.sys.game.device.os.desktop
      case 1: return false
      case 2: return true
    }
  }
  getCheckButton () {
    const btn = this.add.container((70).byRight, (160).byBottom).setSize(80, 80).setInteractive().on('pointerup', () => {
      this.gameScene.nearestCheckable.execTapEvent()
    })
    btn.add(this.add.circle(0, 0, 50, config.COLORS.black, 0.5))
    btn.icon = this.add.sprite(0, 0, 'virtual_button').setAlpha(0.25)
    btn.add(btn.icon)
    return btn
  }
  async systemMessage (message, delay = 1000) {
    const text = this.add.text((20).byRight, 22, message, { align: 'right', fontSize: 12, fontFamily: config.FONTS.TEXT }).setPadding(0, 2, 0, 0).setOrigin(1, 0.5)
    await fadeIn(this, text)
    await fadeOut(this, text, { delay })
    return text
  }
  menu () {
    return new Promise(resolve => new Menu(this, resolve))
  }
  talk (talks, option) {
    return new Promise(resolve => new Talk(this, talks, option, resolve))
  }
  select (options) {
    // return new Promise(resolve => new Select(this, options, resolve)) //TODO
  }
  sleep (time) {
    return new Promise(resolve => setTimeout(() => resolve(), time))
  }
  transition (speed) {
    const duration = SPEED[speed]
    return new Promise(resolve => {
      const rect = this.add.rectangle(0, 0, config.WIDTH, config.HEIGHT, 0x111111).setOrigin(0, 0).setAlpha(0)
      this.add.tween({
        targets: rect,
        duration,
        hold: duration.half,
        alpha: 1,
        yoyo: true,
        onYoyo: resolve,
        onComplete: () => rect.destroy()
      })
    })
  }
  setEventMode (bool) {
    this.eventMode = bool
    if (bool) {
      this.gameScene.player.stopWalk()
      this.blocker.setVisible(true)
      if (this.mapInfo) this.mapInfo.setVisible(false)
    } else {
      if (this.mapInfo) this.mapInfo.setVisible(true)
      this.time.delayedCall(1, () => {
        this.blocker.setVisible(false)
      })
    }
  }
  snapshopForSaveData () {
    return new Promise(resolve => {
      this.scene.sleep('UI')
      this.game.renderer.snapshot(img => {
        this.storage.lastSnapshot = img.src
        this.scene.wake('UI')
        resolve()
      }, 'image/jpeg', 0.25)
    })
  }
  snapShot () {
    const filename = `ScreenShot_${moment().format('YYYYMMDD_HHmmss')}.png`
    this.game.renderer.snapshot(img => downloadBySource(img.src, filename))
  }
}
