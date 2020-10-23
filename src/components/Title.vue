<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="960" :height="540" @pointerdown="tap" />
</template>

<script>
import { inject } from 'vue'
import { Rectangle } from 'phavuer'
export default {
  components: { Rectangle },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    return {
      tap: async () => {
        await gameScene.value.setField('room1', 640, 310)
        context.emit('close')
      }
    }
  }
}
</script>
