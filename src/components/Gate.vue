<template>
  <Zone :active="false" :origin="0" :x="gate.x" :y="gate.y" :width="gate.width" :height="gate.height" @create="onCreate" />
</template>

<script lang="ts" setup>
import * as Phaser from 'phaser'
import { inject, PropType } from 'vue'
import { useScene, Zone } from 'phavuer'
import InjectionKeys from './modules/InjectionKeys'
import { getProperty } from './modules/fieldService'
import config from '../data/config'
import { GateTiledObject } from './modules/tiled'

const props = defineProps({
  gate: { type: Object as PropType<GateTiledObject>, required: true }
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
    const fieldX = getProperty(props.gate, 'fieldX') as number
    const fieldY = getProperty(props.gate, 'fieldY') as number
    fieldManager.setField(name, fieldX * config.TILE_SIZE, fieldY * config.TILE_SIZE)
    collider.destroy()
  })
}
</script>
