import 'phaser'
import { createPhavuerApp } from 'phavuer'
import { createApp } from 'vue'
import './util/extendNativeClassFunctions'
import App from './components/App.vue'
import config from './data/config'
import translate from './data/translate'

window.t = translate

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
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
})
createPhavuerApp(game, createApp(App))
window.game = game
window.addEventListener('resize', () => game.scale.refresh())
