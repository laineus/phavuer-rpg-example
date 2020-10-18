<template>
  <Scene :ref="scene" name="GameScene" :autoStart="true" :config="config" @create="create" @update="update">
    <Field ref="field" :mapKey="config.map" />
  </Scene>
</template>

<script>
import { ref, provide } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field'
export default {
  components: { Scene, Field },
  props: ['config'],
  setup (props, context) {
    const scene = refScene(null)
    const field = ref(null)
    provide('field', field)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      field.value.play(time)
    }
    return {
      scene,
      field,
      create,
      update
    }
  }
}
</script>
