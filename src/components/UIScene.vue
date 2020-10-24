<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update">
    <Title @close="titleScreen = false" v-if="titleScreen" />
    <template v-else>
      <Controller ref="controller" />
      <Talk ref="talk" />
    </template>
    <Rectangle :fillColor="0x000000" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="config.DEPTH.TRANSITION" :alpha="transitionAlpha" />
  </Scene>
</template>

<script>
import { inject, ref } from 'vue'
import { refScene, Scene, Rectangle } from 'phavuer'
import Title from './Title'
import Controller from './Controller'
import Talk from './Talk'
import config from '@/data/config'
export default {
  components: { Scene, Title, Controller, Rectangle, Talk },
  setup (props) {
    const frames = inject('frames')
    const scene = refScene(null)
    const titleScreen = ref(true)
    const transitionAlpha = ref(0)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      frames.total++
    }
    const transition = (duration = 500) => {
      return new Promise(resolve => {
        transitionAlpha.value = 0
        scene.value.add.tween({ targets: transitionAlpha, duration, hold: duration.half, value: 1, yoyo: true, onYoyo: resolve })
      })
    }
    return {
      config,
      create, update,
      scene, controller: ref(null), talk: ref(null),
      titleScreen,
      transition,
      transitionAlpha
    }
  }
}
</script>
