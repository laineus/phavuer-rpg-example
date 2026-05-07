<template>
  <Container>
    <Circle :fillColor="0x000000" :alpha="0.5" :radius="60" @drag="drag" @dragend="dragend" />
    <Circle :fillColor="0xFFFFFF" :alpha="0.25" :radius="30" :x="controller.velocityX * 30" :y="controller.velocityY * 30" />
  </Container>
</template>

<script lang="ts" setup>
import { Input, Math } from 'phaser'
import { Container, Circle } from 'phavuer'
import { inject } from 'vue'
import InjectionKeys from './modules/InjectionKeys'
const controller = inject(InjectionKeys.Controller)!
const drag = (_pointer: Input.Pointer, dragX: number, dragY: number) => {
  const vec = new Math.Vector2(dragX, dragY)
  if (vec.length() > 0) vec.normalize()
  controller.velocityX = vec.x
  controller.velocityY = vec.y
}
const dragend = () => {
  controller.velocityX = 0
  controller.velocityY = 0
}
</script>
