<template>
  <div>
    <Container :x="substance.x" :y="substance.y" :depth="substance.y">
      <Image :texture="`chara_sprite/${substance.name}`" :originX="0.5" :originY="1" v-if="substance.name" :lighting="lighting" />
    </Container>
    <TapArea v-if="substance.checkable" :visible="checkable" type="check" :width="source.width + 15" :height="source.height + 40" :x="substance.x" :y="substance.y - 30" @tap="onTap" />
  </div>
</template>

<script lang="ts" setup>
import { Container, Image, useScene } from 'phavuer'
import { computed, inject, PropType } from 'vue'
import InjectionKeys from '../libs/InjectionKeys'
import { Math } from 'phaser'
import TapArea from './TapArea.vue'
import { MappedTiledData, SubstanceTiledObject } from '../libs/tiled'
const props = defineProps({
  lighting: { type: Boolean, default: false },
  substance: { type: Object as PropType<MappedTiledData<SubstanceTiledObject>>, required: true }
})
const scene = useScene()
const field = inject(InjectionKeys.Field)!
const textureKey = computed(() => `chara_sprite/${props.substance.name}`)
const source = computed(() => scene.textures.get(textureKey.value).source[0])
const checkable = computed(() => {
  const player = field.player
  return Math.Distance.Between(player.x, player.y, props.substance.x!, props.substance.y!) < 150
})
const onTap = () => {
  field.event.emit('substanceCheck', { id: props.substance.id })
}
</script>
