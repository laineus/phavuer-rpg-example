<template>
  <Scene ref="scene" name="GameScene" :autoStart="true" @preload="preload" @update="update" v-slot="{ preloaded }">
    {{ fps }}
    <Field v-if="preloaded && fieldManager.key" :key="fieldManager.key" />
  </Scene>
</template>

<script lang="ts">
import { ref, reactive, provide, inject, nextTick, defineComponent } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field.vue'
import assets from '../data/assets.json'
import InjectionKeys from './modules/InjectionKeys'
export default defineComponent({
  components: { Scene, Field },
  setup (props, context) {
    const fieldManager = inject(InjectionKeys.FieldManager)!
    const fieldData = reactive({ name: null, x: 0, y: 0, r: 0 })
    const scene = refScene(null)
    const uiScene = inject('uiScene')
    const field = ref(null)
    const fps = ref(0)
    provide('field', field)
    const preload = (scene) => {
      Object.entries(assets).forEach(([method, list]) => {
        list.forEach(args => scene.load[method](...args))
      })
    }
    const update = (scene, time) => {
      if (!field.value) return
      fps.value = Math.round(scene.game.loop.actualFps)
      const controller = uiScene.value.controller
      if (controller.velocityX || controller.velocityY) {
        const x = Math.fix(field.value.player.object.x + controller.velocityX, 0, field.value.field.width)
        const y = Math.fix(field.value.player.object.y + controller.velocityY, 0, field.value.field.height)
        field.value.player.following.setTargetPosition(x, y)
      } else if (controller.activePointer) {
        // const worldX = controller.activePointer.x + camera.value.scrollX
        // const worldY = controller.activePointer.y + camera.value.scrollY
        // if (field.value.isCollides(worldX.toTile, worldY.toTile)) return
        // field.value.player.following.setTargetPosition(worldX, worldY)
      }
    }
    return {
      fieldManager,
      fps,
      scene,
      field,
      preload,
      update,
      fieldData
    }
  }
})
</script>
