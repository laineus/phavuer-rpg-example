<template>
  <Container :x="0" :y="0" v-if="talk.current" :depth="constants.DEPTH.SPEACH_BUBBLE">
    <Container :x="x" :y="y">
      <Rectangle :origin="0.5" :fillColor="0x222222" :alpha="0.8" :width="bgSize.width" :height="bgSize.height" :displayOriginX="bgSize.width / 2" :displayOriginY="bgSize.height / 2" />
      <Text :text="talk.current.talker.name" :style="{ fontSize: 15, fontStyle: 'bold', color: '#FFFFFF', stroke: '#111111', strokeThickness: 3 }" :originX="0" :originY="1" :x="-(bgSize.width / 2) + 8" :y="-(bgSize.height / 2) + 8" />
      <Text :key="talk.current.message" :text="talk.current.message" :style="{ fontSize: 14, fontStyle: 'normal', color: '#FFFFFF' }" :origin="0.5" @create="onCreate" />
    </Container>
    <Rectangle :origin="0" :scrollFactorX="0" :scrollFactorY="0" :width="constants.WIDTH" :height="constants.HEIGHT" @pointerdown="talk.next" />
  </Container>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, watch } from 'vue'
import InjectionKeys from '../libs/InjectionKeys'
import constants from '../data/constants'
import { Container, Rectangle, Text } from 'phavuer'
import { GameObjects } from 'phaser'

const freeze = inject(InjectionKeys.Freeze)!
const talk = inject(InjectionKeys.Talk)!
const x = computed(() => talk.current.talker.pos.x)
const y = computed(() => talk.current.talker.pos.y - 70)
const bgSize = reactive({
  width: 0,
  height: 0
})
const onCreate = (v: GameObjects.Text) => {
  bgSize.width = Math.max(v.width + 20, 100)
  bgSize.height = v.height + 20
}
let unfreeze: (() => void) | null = null
watch(() => !!talk.current, talking => {
  if (talking) {
    unfreeze = freeze.freeze()
  } else {
    unfreeze?.()
    unfreeze = null
  }
})
</script>
