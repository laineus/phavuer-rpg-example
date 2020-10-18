<template>
  <div>
    <GameScene :config="{ map: 'room1', x: 610, y: 340 }" />
  </div>
</template>

<script>
import GameScene from '@/components/GameScene'
import { inject } from 'vue'
export default {
  components: { GameScene },
  setup () {
    const game = inject('game')
    Phaser.BlendModes.OVERLAY = game.renderer.addBlendMode([WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE], WebGLRenderingContext.FUNC_ADD)
  }
}
</script>
