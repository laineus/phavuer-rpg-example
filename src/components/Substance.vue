<template>
  <div>
    <Container :x="substance.x" :y="substance.y" :depth="substance.y">
      <Image :texture="`chara_sprite/${substance.name}`" :originX="0.5" :originY="1" v-if="substance.name" :lighting="lighting" />
    </Container>
    <TapArea v-if="event" :visible="checkable" type="check" :width="source.width + 15" :height="source.height + 40" :x="substance.x" :y="substance.y" @tap="onTap" />
  </div>
</template>

<script lang="ts" setup>
import { Container, Image, useScene } from 'phavuer'
import { computed, inject, PropType } from 'vue'
import { TiledObject } from './modules/fieldService'
import InjectionKeys from './modules/InjectionKeys'
import { Math } from 'phaser'
import TapArea from './TapArea.vue'
const props = defineProps({
  lighting: { type: Boolean, default: false },
  substance: { type: Object as PropType<TiledObject>, required: true }
})
const scene = useScene()
const field = inject(InjectionKeys.Field)!
const textureKey = computed(() => `chara_sprite/${props.substance.name}`)
const source = computed(() => scene.textures.get(textureKey.value).source[0])
const checkable = computed(() => {
  const player = field.player
  return Math.Distance.Between(player.x, player.y, props.substance.x!, props.substance.y!) < 150
})
const event = field.events.get(props.substance.id)
const onTap = () => {
  event!()
}
</script>
