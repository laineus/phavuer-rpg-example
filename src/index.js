import 'phaser'
import '@/util/extendNativeClassFunctions'
import BootScene from '@/scenes/BootScene'
import GameScene from '@/scenes/GameScene'
import UIScene from '@/scenes/UIScene'
import config from '@/data/config'
import storage from '@/data/storage'

location.query = location.search.substr(1).split('&').filter(Boolean).reduce((obj, v) => {
  const arr = v.split('=')
  obj[arr[0]] = arr[1]
  return obj
}, {})

storage.loadSetting()

const option = {
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
  scene: [BootScene, GameScene, UIScene],
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  audio: {
    disableWebAudio: true
  },
  input: {
    activePointers: 3
  }
  // fps: { target: 30, forceSetTimeOut: true }
}

const game = new Phaser.Game(option)
window.game = game
window.addEventListener('resize', () => game.scale.refresh())
