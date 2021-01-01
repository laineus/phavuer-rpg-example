import 'phaser'
import { createPhavuerApp } from 'phavuer'
import assets from 'assets'
import '@/util/extendNativeClassFunctions'
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
      Object.keys(assets).forEach(method => {
        assets[method].forEach(args => {
          this.load[method](...args)
        })
      })
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
