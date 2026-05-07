<template>
  <Container :depth="config.DEPTH.TAP_AREA" @pointerdown="onTap">
    <Image texture="speach_bubbles" :y="-20" :frame="type === 'talk' ? 1 : 0" :tween="tween" />
  </Container>
</template>

<script lang="ts" setup>
import { Container, Image } from 'phavuer'
import { PropType } from 'vue'
import config from '../data/config'
const props = defineProps({
  type: { type: String as PropType<'talk' | 'check'> }
})
const emit = defineEmits(['tap'])
const onTap = () => {
  emit('tap')
}
const tween = { y: -24, yoyo: true, repeat: -1, duration: 500 }
</script>
