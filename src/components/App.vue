<template>
  <div>
    <GameScene ref="gameScene" :config="{ map: 'room1', x: 610, y: 340 }" />
    <UIScene ref="uiScene" />
  </div>
</template>

<script>
import GameScene from '@/components/GameScene'
import UIScene from '@/components/UIScene'
import { inject, provide, ref, computed } from 'vue'
export default {
  components: { GameScene, UIScene },
  setup () {
    const game = inject('game')
    Phaser.BlendModes.OVERLAY = game.renderer.addBlendMode([WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE], WebGLRenderingContext.FUNC_ADD)
    const gameScene = ref(null)
    const uiScene = ref(null)
    provide('gameScene', gameScene)
    provide('field', computed(() => gameScene.value?.field))
    provide('camera', computed(() => gameScene.value?.camera))
    provide('player', computed(() => gameScene.value?.field.player))
    provide('uiScene', uiScene)
    return {
      gameScene, uiScene
    }
  }
}
</script>
