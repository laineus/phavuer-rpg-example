<template>
  <div>
    <Container v-model:x="character.x" v-model:y="character.y" :width="30" :height="20" :depth="character.y" @create="onCreate">
      <Image texture="chara_sprite/player" :frame :originX="0.5" :originY="1" :lighting="lighting" />
      <Body :velocityX="character.velocityX" :velocityY="character.velocityY" />
    </Container>
  </div>
</template>

<script lang="ts" setup>
import { Body, Container, Image } from 'phavuer'
import { Player } from './modules/fieldService'
import {  inject, PropType } from 'vue'
import useCharacterAnim from './modules/useCharacterAnim'
import InjectionKeys from './modules/InjectionKeys'
import { GameObjects } from 'phaser'

const props = defineProps({
  lighting: { type: Boolean, default: false },
  character: { type: Object as PropType<Player>, required: true }
})

const field = inject(InjectionKeys.Field)!

const group = inject(InjectionKeys.ColliderGroup)!
const frame = useCharacterAnim(props.character)

const onCreate = (container: GameObjects.Container) => {
  field.setPlayerGameObject(container)
  group.add(container)
}
</script>
