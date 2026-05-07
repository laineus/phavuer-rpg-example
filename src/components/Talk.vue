<template>
  <Container :x="0" :y="0" v-if="talk.current">
    <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="talk.next" />
    <Container :x="x" :y="y">
      <Rectangle :origin="0.5" :fillColor="0x222222" :alpha="0.8" :width="bgSize.width" :height="bgSize.height" :displayOriginX="bgSize.width / 2" :displayOriginY="bgSize.height / 2" />
      <Text :text="talk.current.talker.name" :style="{ fontSize: 15, fontStyle: 'bold', color: '#FFFFFF', stroke: '#111111', strokeThickness: 3 }" :originX="0" :originY="1" :x="-(bgSize.width / 2) + 8" :y="-(bgSize.height / 2) + 8" />
      <Text :key="talk.current.message" :text="talk.current.message" :style="{ fontSize: 14, fontStyle: 'normal', color: '#FFFFFF' }" :origin="0.5" @create="onCreate" />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import InjectionKeys from './modules/InjectionKeys'
import config from '../data/config'
import { Container, Rectangle, Text, useScene } from 'phavuer'
import { GameObjects } from 'phaser'

const scene = useScene()
const camera = scene.cameras.main
const talk = inject(InjectionKeys.Talk)!
const x = computed(() => talk.current.talker.pos.x - camera.scrollX)
const y = computed(() => talk.current.talker.pos.y - camera.scrollY - 70)
const bgSize = reactive({
  width: 0,
  height: 0
})
const onCreate = (v: GameObjects.Text) => {
  bgSize.width = Math.max(v.width + 20, 100)
  bgSize.height = v.height + 20
}
</script>
