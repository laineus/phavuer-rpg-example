<template>
  <Scene :ref="scene" name="GameScene" :autoStart="true" :config="config" @create="create" @update="update">
    <Field :mapKey="config.map" />
  </Scene>
</template>

<script>
import { refScene, Scene } from 'phavuer'
import Field from './Field'
export default {
  components: { Scene, Field },
  props: ['config'],
  setup (props, context) {
    const scene = refScene(null)
    const create = (scene, payload) => {
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
