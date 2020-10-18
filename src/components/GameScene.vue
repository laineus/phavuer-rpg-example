<template>
  <Scene :ref="scene" name="GameScene" :autoStart="true" :config="config" @create="create" @update="update">
    <Field :mapKey="config.map" />
  </Scene>
</template>

<script>
import { refScene, Scene, Rectangle } from 'phavuer'
import Field from './Field'
import { ref } from 'vue'
export default {
  components: { Scene, Rectangle, Field },
  props: ['config'],
  setup (props, context) {
    const scene = refScene(null)
    const config = ref(props.config)
    const create = (scene, payload) => {
      config.value = payload
    }
    const update = (scene) => {
    }
    return {
      config,
      scene,
      create,
      update
    }
  }
}
</script>
