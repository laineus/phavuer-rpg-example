<template>
  <VirtualStick :x="80" :y="byBottom(80)" v-if="isMobile" />
</template>

<script lang="ts" setup>
import { onPreUpdate, useScene } from 'phavuer'
import { inject } from 'vue'
import VirtualStick from './VirtualStick.vue'
import InjectionKeys from './modules/InjectionKeys'
import useWasdController from './modules/useWasdController'
import config from '../data/config'
const byBottom = (v: number) => {
  return config.HEIGHT - v
}
const isMobile = inject(InjectionKeys.Mobile)!
const controller = inject(InjectionKeys.Controller)!
const scene = useScene()
const wasd = !isMobile && scene.input.keyboard && useWasdController(scene.input.keyboard) 
if (wasd) {
  onPreUpdate(() => {
    const { x, y } = wasd.getVelocity()
    controller.velocityX = x
    controller.velocityY = y
  })
}
</script>
