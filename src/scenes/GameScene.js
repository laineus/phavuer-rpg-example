import Player from '@/gameObjects/Player'
import Field from '@/class/Field'
import maps from '@/data/maps'
import assets from '@/data/assets'
import storage from '@/data/storage'
import downloadBySource from '@/util/downloadBySource'
import Character from '@/gameObjects/Character'
import Substance from '@/gameObjects/Substance'
import config from '@/data/config'
export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'Game', active: false })
  }
  create (payload) {
    this.frame = 0
    this.storage = storage
    // substance group
    this.substances = this.add.group()
    // player
    this.player = new Player(this, payload.x, payload.y).setR(this.storage.state.r).setDisplayName(t('chara.ann'))
    if (['number', 'string'].includes(typeof payload.r)) this.player.setR(payload.r)
    // map
    this.map = new Field(this, payload.map)
    // camera
    this.camera = this.getCamera()
    this.event = maps[payload.map] || {}
    this.ui.audio.setBgm(this.event.bgm || null)
    if (this.event.create) this.event.create(this)
    // debug
    if (ENV === 'development') this.setDebugAction()
  }
  update (time) {
    this.frame++
    if (this.event.update) this.event.update(this)
    this.map.update(time)
    if (this.ui.eventMode) return
    if (this.ui.controller.touchMode) {
      this.walkWithStick()
    } else {
      config.WALK_MODE_PC === 0 ? this.walkOnTap() : this.walkWithStick()
    }
  }
  walkWithStick () {
    const x = Math.fix(this.player.x + this.ui.controller.velocityX, 0, this.map.width)
    const y = Math.fix(this.player.y + this.ui.controller.velocityY, 0, this.map.height)
    this.player.setTargetPosition(x, y)
  }
  walkOnTap () {
    const activePointer = this.ui.controller.activePointer
    if (!activePointer) return
    const worldX = activePointer.x + this.camera.scrollX
    const worldY = activePointer.y + this.camera.scrollY
    if (this.map.isCollides(worldX.toTile, worldY.toTile)) return
    this.player.setTargetPosition(worldX, worldY)
  }
  get ui () {
    return this.scene.get('UI')
  }
  get audio () {
    return this.ui.audio
  }
  get touchMode () {
    return this.ui.touchMode
  }
  get npcList () {
    const checkableClasses = [Character, Substance]
    return this.children.list.filter(v => checkableClasses.includes(v.constructor))
  }
  get checkables () {
    return this.npcList.filter(v => v.checkable)
  }
  get nearestCheckable () {
    const distance = Math.min(...this.checkables.map(v => v.distanceToPlayer))
    return this.checkables.find(v => v.distanceToPlayer === distance)
  }
  talk (talks, option) {
    return this.ui.talk(talks, option)
  }
  select (options, callback) {
    return this.ui.select(options, callback)
  }
  mapChange (mapKey, x, y, { r = null, save = true, speed = 'fast', informMapName } = {}) {
    this.ui.battlerSummary.hide()
    this.alreadyTweetLost = false
    this.scene.pause('Game')
    const encountDelay = Math.max(this.encountDelay, 300)
    return this.ui.transition(speed).then(() => {
      this.scene.start('Game', { map: mapKey, x, y, r, save, encountDelay, informMapName })
    })
  }
  getCamera () {
    const camera = this.cameras.main
    camera.setBounds(0, 0, this.map.width, this.map.height)
    camera.roundPixels = true
    camera.setZoom(1)
    camera.startFollow(this.player, true, 0.1, 0.1)
    camera.updateFollow = () => camera.centerOn(camera._follow.x, camera._follow.y)
    camera.look = (x, y, duration, relative = false) => {
      const newX = relative ? (camera.scrollX + camera.centerX + x) : x
      const newY = relative ? (camera.scrollY + camera.centerY + y) : y
      const offsetX = newX - camera._follow.x
      const offsetY = newY - camera._follow.y
      return new Promise(resolve => {
        camera.pan(newX, newY, duration, 'Power2', false, (_, progress) => {
          if (progress === 1) {
            camera.setFollowOffset(-offsetX, -offsetY)
            resolve()
          }
        })
      })
    }
    camera.revert = (duration = 0) => camera.look(camera._follow.x, camera._follow.y, duration)
    return camera
  }
  async tweetOnce (chara, message, key) {
    if (this.storage.state.tweets.includes(key)) return false
    this.storage.state.tweets.push(key)
    return chara.tweet(message)
  }
  setDebugAction () {
    window.storage = storage
    this.input.keyboard.on('keydown_I', () => {
      console.log(`x: ${this.player.x}, y: ${this.player.y}, tileX: ${this.player.x.toTile} tileY: ${this.player.y.toTile}`)
      console.log(this.storage.state)
    })
    this.input.keyboard.on('keydown_M', () => {
      const debugBox = document.createElement('div')
      debugBox.setAttribute('class', 'debugBox')
      document.getElementById('game').appendChild(debugBox)
      // Map selecter
      const select = document.createElement('select')
      select.id = 'select'
      debugBox.appendChild(select)
      assets.tilemapTiledJSON.forEach(v => {
        const option = document.createElement('option')
        option.value = v[0]
        option.text = v[0]
        select.appendChild(option)
      })
      select.onchange = () => this.mapChange(select.value, (20).toPixelCenter, (20).toPixelCenter)
      // Data import
      const dataImport = document.createElement('input')
      dataImport.type = 'file'
      dataImport.innerText = 'Data Import'
      dataImport.onchange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = e => {
          const json = e.target.result
          this.storage.state = this.storage.fixState(JSON.parse(json))
          this.mapChange(this.storage.state.map, this.storage.state.x, this.storage.state.y, { save: false })
        }
      }
      debugBox.appendChild(dataImport)
      // Data export
      const dataExport = document.createElement('button')
      dataExport.innerText = 'Data Export'
      dataExport.onclick = () => {
        const blob = new Blob([JSON.stringify(this.storage.state, null, '  ')], { type: 'text/json' })
        downloadBySource(URL.createObjectURL(blob), 'savedata.json')
      }
      debugBox.appendChild(dataExport)
      // FPS
      const info = document.createElement('span')
      debugBox.appendChild(info)
      setInterval(() => {
        info.innerText = `FPS: ${this.game.loop.actualFps}`
      }, 100)
    })
  }
}
