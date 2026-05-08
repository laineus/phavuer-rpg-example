<template>
  <div>
    <Container v-model:x="character.x" v-model:y="character.y" :width="30" :height="20" :depth="character.y" @create="onCreate">
      <Image :texture="`chara_sprite/${character.name}`" :frame :originX="0.5" :originY="1" :lighting="lighting" />
      <Body :velocityX="character.velocityX" :velocityY="character.velocityY" />
    </Container>
    <TapArea v-if="character.checkable" :visible="checkable" type="talk" :width="source.width + 15" :height="source.height + 40" :x="character.x" :y="character.y - 30" @tap="onTap" />
  </div>
</template>

<script lang="ts" setup>
import { Body, Container, Image, useScene } from 'phavuer'
import { computed, inject, PropType } from 'vue'
import useCharacterAnim from './modules/useCharacterAnim'
import InjectionKeys from './modules/InjectionKeys'
import { GameObjects, Math } from 'phaser'
import TapArea from './TapArea.vue'
import { Character } from './modules/useCharacter'

const props = defineProps({
  lighting: { type: Boolean, default: false },
  character: { type: Object as PropType<Character>, required: true }
})

const scene = useScene()
const group = inject(InjectionKeys.ColliderGroup)!
const field = inject(InjectionKeys.Field)!
const frame = useCharacterAnim(props.character)
const textureKey = computed(() => `chara_sprite/${props.character.name}`)
const source = computed(() => scene.textures.get(textureKey.value).source[0])
const checkable = computed(() => {
  const player = field.player
  return Math.Distance.Between(player.x, player.y, props.character.x, props.character.y) < 150
})
const onCreate = (container: GameObjects.Container) => {
  group.add(container)
}
const onTap = () => {
  field.event.emit('characterCheck', { id: props.character.id })
}
</script>
