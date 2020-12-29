import 'phaser'
import { createPhavuerApp } from 'phavuer'
import '@/util/extendNativeClassFunctions'
import loadAssets from '@/util/loadAssets'
import App from '@/components/App'
import config from '@/data/config'

const option = {
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
  scene: {
    create () {
      createPhavuerApp(this.game, App)
    },
    preload () {
      loadAssets(this)
    }
  },
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 0 }
    }
  },
  audio: {
    disableWebAudio: true
  },
  input: {
    activePointers: 3
  }
}

const game = new Phaser.Game(option)
window.game = game
window.addEventListener('resize', () => game.scale.refresh())
