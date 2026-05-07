<template>
  <Zone :active="false" :origin="0" :x="area.x" :y="area.y" :width="area.width" :height="area.height" @create="onCreate" />
</template>

<script lang="ts" setup>
import * as Phaser from 'phaser'
import { inject, PropType } from 'vue'
import { onPreUpdate, useScene, Zone } from 'phavuer'
import InjectionKeys from './modules/InjectionKeys'
import { AreaTiledObject } from './modules/tiled'

const props = defineProps({
  area: { type: Object as PropType<AreaTiledObject>, required: true }
})

const scene = useScene()
const field = inject(InjectionKeys.Field)!
const onCreate = (zone: Phaser.GameObjects.Zone) => {
  scene.physics.world.enable(zone)
  let isOverlapping = false
  onPreUpdate(() => {
    if (scene.physics.overlap(zone, field.player.gameObject)) {
      if (!isOverlapping) {
        isOverlapping = true
        field.events.get(props.area.id)?.()
      }
    } else {
      isOverlapping = false
    }
  })
}
</script>
