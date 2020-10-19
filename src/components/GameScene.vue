<template>
  <Scene ref="scene" name="GameScene" :autoStart="true" :config="config" @create="create" @update="update">
    {{ fps }}
    <Field ref="field" :mapKey="config.map" :playerX="config.x" :playerY="config.y" :playerR="config.r" />
  </Scene>
</template>

<script>
import { ref, provide, inject } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field'
export default {
  components: { Scene, Field },
  props: ['config'],
  setup (props, context) {
    const scene = refScene(null)
    const uiScene = inject('uiScene')
    const field = ref(null)
    const fps = ref(0)
    provide('field', field)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      fps.value = Math.round(scene.game.loop.actualFps)
      field.value.play(time)
      const controller = uiScene.value.controller
      if (controller.velocityX || controller.velocityY) {
        const x = Math.fix(field.value.player.chara.x + controller.velocityX, 0, field.value.field.width)
        const y = Math.fix(field.value.player.chara.y + controller.velocityY, 0, field.value.field.height)
        field.value.player.following.setTargetPosition(x, y)
      } else {
        field.value.player.following.clearTargetPosition()
      }
    }
    return {
      fps,
      scene,
      field,
      create,
      update
    }
  }
}
</script>
