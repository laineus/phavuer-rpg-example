<template>
  <Image
    :texture="textureKey"
    :x="imageLayerData.offsetx"
    :y="imageLayerData.offsety"
    :origin="0"
    :lighting="lighting"
    :depth="imageLayerData.offsety + source.height"
  />
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { Image, useScene } from 'phavuer'
import { ImageLayerData } from './modules/tiled'

const props = defineProps({
  lighting: { type: Boolean, default: false },
  imageLayerData: {
    type: Object as PropType<ImageLayerData>,
    required: true
  }
})

const scene = useScene()
const key = computed(() => props.imageLayerData.image.split('/').slice(-1)[0].split('.')[0])
const textureKey = computed(() => `tileset/${key.value}`)
const source = computed(() => scene.textures.get(textureKey.value).source[0])
</script>
