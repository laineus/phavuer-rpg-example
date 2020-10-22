<template>
  <Scene ref="scene" name="GameScene" :autoStart="true" :config="config" @update="update">
    {{ fps }}
    <Field ref="field" :mapKey="config.map" :playerX="config.x" :playerY="config.y" :playerR="config.r" />
  </Scene>
</template>

<script>
import { ref, provide, inject, onMounted } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field'
import setupCamera from './modules/setupCamera'
import maps from '@/data/maps'
export default {
  components: { Scene, Field },
  props: ['config'],
  setup (props, context) {
    const scene = refScene(null)
    const frames = inject('frames')
    const uiScene = inject('uiScene')
    const camera = ref(null)
    const field = ref(null)
    const fps = ref(0)
    provide('field', field)
    const event = maps[props.config.map]
    onMounted(() => {
      camera.value = scene.value.cameras.main
      setupCamera(camera.value, field.value.width, field.value.height, field.value.player.object)
      if (event?.create) event.create()
    })
    const update = (scene, time) => {
      frames.game++
      fps.value = Math.round(scene.game.loop.actualFps)
      field.value.play(time)
      const controller = uiScene.value.controller
      if (controller.velocityX || controller.velocityY) {
        const x = Math.fix(field.value.player.object.x + controller.velocityX, 0, field.value.field.width)
        const y = Math.fix(field.value.player.object.y + controller.velocityY, 0, field.value.field.height)
        field.value.player.following.setTargetPosition(x, y)
      } else {
        field.value.player.following.clearTargetPosition()
      }
      if (event?.update) event.update()
    }
    return {
      fps,
      scene,
      field,
      camera,
      update
    }
  }
}
</script>
