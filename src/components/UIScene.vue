<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update">
    <Controller ref="controller" />
    <Talk ref="talk" />
  </Scene>
</template>

<script>
import { inject, ref } from 'vue'
import { refScene, Scene } from 'phavuer'
import Controller from './Controller'
import Talk from './Talk'
export default {
  components: { Scene, Controller, Talk },
  setup (props) {
    const frames = inject('frames')
    const scene = refScene(null)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      frames.total++
    }
    return {
      scene,
      create,
      update,
      controller: ref(null),
      talk: ref(null)
    }
  }
}
</script>
