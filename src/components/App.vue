<template>
  <div>
    <GameScene ref="gameScene" />
    <UIScene ref="uiScene" />
  </div>
</template>

<script>
import GameScene from './GameScene.vue'
import UIScene from './UIScene.vue'
import AudioController from '../class/AudioController'
import { provide, ref, computed, reactive } from 'vue'
import { useGame } from 'phavuer'
export default {
  components: { GameScene, UIScene },
  setup () {
    const game = useGame()
    Phaser.BlendModes.OVERLAY = game.renderer.addBlendMode([WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE], WebGLRenderingContext.FUNC_ADD)
    const gameScene = ref(null)
    const uiScene = ref(null)
    const event = reactive({
      state: false,
      setState (bool) { this.state = bool },
      exec (event) {
        this.setState(true)
        const promise = event()
        if (!promise || typeof promise.then !== 'function') throw new Error('Event must returns Promise instance')
        return promise.then(result => {
          this.setState(false)
          return result
        })
      }
    })
    const frames = reactive({ total: 0, game: 0 })
    provide('event', event)
    provide('frames', frames)
    provide('gameScene', gameScene)
    provide('field', computed(() => gameScene.value?.field))
    provide('camera', computed(() => gameScene.value?.scene.cameras.main))
    provide('player', computed(() => gameScene.value?.field?.player))
    provide('uiScene', uiScene)
    provide('talk', computed(() => uiScene.value?.talk))
    provide('mobile', !game.device.os.desktop)
    provide('audio', new AudioController(game.sound))
    return {
      gameScene, uiScene
    }
  }
}
</script>
