<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update">
    <Controller ref="controller" />
    <Talk ref="talk" />
    <Rectangle :fillColor="0x000000" :origin="0" :width="960" :height="540" :alpha="transitionAlpha" />
  </Scene>
</template>

<script>
import { inject, ref } from 'vue'
import { refScene, Scene, Rectangle } from 'phavuer'
import Controller from './Controller'
import Talk from './Talk'
export default {
  components: { Scene, Controller, Rectangle, Talk },
  setup (props) {
    const frames = inject('frames')
    const scene = refScene(null)
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
      scene,
      create,
      update,
      controller: ref(null),
      talk: ref(null),
      transition,
      transitionAlpha
    }
  }
}
</script>
