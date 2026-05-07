<template>
  <Scene name="GameScene" :autoStart="true" @preload="preload" @update="update" v-slot="{ preloaded }">
    <Field v-if="preloaded && fieldManager.key" :key="fieldManager.key" />
  </Scene>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { Scene } from 'phavuer'
import Field from './Field.vue'
import assets from '../data/assets.json'
import InjectionKeys from './modules/InjectionKeys'

const fieldManager = inject(InjectionKeys.FieldManager)!
const preload = (scene: Phaser.Scene) => {
  Object.entries(assets).forEach(([method, list]) => {
    list.forEach(args => scene.load[method](...args))
  })
}
const update = (scene: Phaser.Scene, time: number) => {
  // const controller = uiScene.value.controller
  // if (controller.velocityX || controller.velocityY) {
  //   const x = Math.fix(field.value.player.object.x + controller.velocityX, 0, field.value.field.width)
  //   const y = Math.fix(field.value.player.object.y + controller.velocityY, 0, field.value.field.height)
  //   field.value.player.following.setTargetPosition(x, y)
  // } else if (controller.activePointer) {
  //   const worldX = controller.activePointer.x + camera.value.scrollX
  //   const worldY = controller.activePointer.y + camera.value.scrollY
  //   if (field.value.isCollides(worldX.toTile, worldY.toTile)) return
  //   field.value.player.following.setTargetPosition(worldX, worldY)
  // }
}
</script>
