<template>
  <Zone :active="false" :origin="0" :x="gate.x" :y="gate.y" :width="gate.width" :height="gate.height" @create="onCreate" />
</template>

<script lang="ts" setup>
import * as Phaser from 'phaser'
import { inject, PropType } from 'vue'
import { useScene, Zone } from 'phavuer'
import InjectionKeys from '../libs/InjectionKeys'
import constants from '../data/constants'
import { GateTiledObject, MappedTiledData } from '../libs/tiled'

const props = defineProps({
  gate: { type: Object as PropType<MappedTiledData<GateTiledObject>>, required: true }
})

const scene = useScene()
const field = inject(InjectionKeys.Field)!
const fieldManager = inject(InjectionKeys.FieldManager)!
const onCreate = (zone: Phaser.GameObjects.Zone) => {
  scene.physics.world.enable(zone)
  const playerGameObject = field.player.gameObject
  if (!playerGameObject) return
  const collider = scene.physics.add.overlap(zone, playerGameObject, () => {
    const name = props.gate.name
    const fieldX = props.gate.fieldX
    const fieldY = props.gate.fieldY
    fieldManager.setField(name, fieldX * constants.TILE_SIZE, fieldY * constants.TILE_SIZE)
    collider.destroy()
  })
}
</script>
