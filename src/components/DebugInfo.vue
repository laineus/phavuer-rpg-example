<template>
  <div>
    FPS: {{ fps }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useGame } from 'phavuer'

const fps = ref(0)
const game = useGame()
const update = () => {
  fps.value = Math.round(game.loop.actualFps)
  requestAnimationFrame(update)
}
update()
</script>

<style scoped>
div {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-family: monospace;
  padding: 4px;
}
</style>
