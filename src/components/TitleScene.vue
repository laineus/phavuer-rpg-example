<template>
  <Scene name="TitleScene" :autoStart="true" @preload="preload" v-slot="{ preloaded }">
    <template v-if="preloaded">
      <Rectangle :width="constants.WIDTH" :height="constants.HEIGHT" :fillColor="0x000000" :origin="0" @pointerup="start" />
      <Text text="Tap to Start" :x="constants.WIDTH / 2" :y="constants.HEIGHT / 2" :origin="0.5" :style="style" />
    </template>
    <Container :x="constants.WIDTH / 2" :y="constants.HEIGHT / 2" v-else>
      <Text :text="`Loading ${Math.round(progress * 100)}%`" :origin="0.5" :y="-20" :style="style" />
      <Rectangle :width="200" :height="3" :fillColor="0x333333" :originY="0" />
      <Rectangle :width="200" :height="3" :fillColor="0xffffff" :originX="0" :originY="0" :x="-100" :scaleX="progress" />
    </Container>
  </Scene>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { Container, Rectangle, Scene, Text } from 'phavuer'
import assets from '../data/assets.json'
import constants from '../data/constants'
const emit = defineEmits(['start'])

const style = {
  fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Noto Sans JP", sans-serif',
  fontSize: 16,
  color: '#FFFFFF'
}
const progress = ref(0)
const preload = (scene: Phaser.Scene) => {
  scene.load.on('progress', (value: number) => {
    progress.value = Math.max(value, progress.value)
  })
  Object.entries(assets).forEach(([method, list]) => {
    // @ts-expect-error
    list.forEach(args => scene.load[method](...args))
  })
}
const start = () => emit('start')
</script>
