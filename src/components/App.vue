<template>
  <div>
    <GameScene />
  </div>
</template>

<script>
import GameScene from '@/components/GameScene'
export default {
  components: { GameScene },
  setup () {
    Phaser.BlendModes.OVERLAY = this.sys.game.renderer.addBlendMode([WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE], WebGLRenderingContext.FUNC_ADD)
  }
}
</script>
