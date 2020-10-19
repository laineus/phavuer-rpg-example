<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update">
    <Controller ref="controller" />
    <Talk />
  </Scene>
</template>

<script>
import { ref } from 'vue'
import { refScene, Scene } from 'phavuer'
import Controller from './Controller'
import Talk from './Talk'
export default {
  components: { Scene, Controller, Talk },
  setup (props) {
    const scene = refScene(null)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
    }
    return {
      scene,
      create,
      update,
      controller: ref(null)
    }
  }
}
</script>
