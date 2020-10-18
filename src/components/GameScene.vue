<template>
  <Scene :ref="scene" name="GameScene" :autoStart="true" @create="create" @update="update">
  </Scene>
</template>

<script>
import { refScene, Scene, Rectangle } from 'phavuer'
export default {
  components: { Scene, Rectangle },
  setup (props, context) {
    const scene = refScene(null)
    const create = (scene) => {
    }
    const update = (scene) => {
    }
    return {
      scene,
      create,
      update
    }
  }
}
</script>
