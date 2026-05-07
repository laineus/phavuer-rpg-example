<template>
  <Image :depth="config.DEPTH.DARKNESS" texture="darkness" :x="0" :y="0" :origin="0" />
</template>

<script lang="ts" setup>
import useDarkness from './modules/useDarkness'
import { inject, onBeforeUnmount } from 'vue'
import { Image, useScene, onPreUpdate } from 'phavuer'
import config from '../data/config'
import InjectionKeys from './modules/InjectionKeys'
const field = inject(InjectionKeys.Field)!
const scene = useScene()
scene.textures.remove('darkness')
const darkness = useDarkness(scene, 'darkness', field.tilemap.widthInPixels, field.tilemap.heightInPixels)
darkness.fillBg(field.properties.darkness || 0x77000000)
darkness.removeArcs(field.lights.map(l => {
  return { x: l.x!, y: l.y!, radius: 120 }
}))
darkness.save()
darkness.refresh()
onPreUpdate(() => {
  darkness.restore()
  darkness.removeArc(field.player.x, field.player.y, 300)
  darkness.refresh()
})
onBeforeUnmount(() => {
  darkness.destroy()
})
</script>
