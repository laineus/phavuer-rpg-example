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
