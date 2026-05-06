<template>
  <Zone ref="object" :active="false" :origin="0" :x="gate.x" :y="gate.y" :width="gate.width" :height="gate.height" @create="onCreate" />
</template>

<script lang="ts"setup >
import * as Phaser from 'phaser'
import { inject, PropType } from 'vue'
import { useScene, Zone } from 'phavuer'
import InjectionKeys from './modules/InjectionKeys'
import { GateTiledObject, getProperty } from './modules/fieldService'
import config from '../data/config'
// const FRAMES_FOR_NEW_ENTER = 10

const props = defineProps({
  gate: { type: Object as PropType<GateTiledObject>, required: true }
})

const scene = useScene()
const field = inject(InjectionKeys.Field)!
const fieldManager = inject(InjectionKeys.FieldManager)!
const onCreate = (zone: Phaser.GameObjects.Zone) => {
  scene.physics.world.enable(zone)
  const playerGameObject = field.getPlayerGameObject()
  const collider = scene.physics.add.overlap(zone, playerGameObject, () => {
    const name = props.gate.name
    const fieldX = getProperty(props.gate, 'fieldX') as number
    const fieldY = getProperty(props.gate, 'fieldY') as number
    fieldManager.setField(name, fieldX * config.TILE_SIZE, fieldY * config.TILE_SIZE)
    collider.destroy()
  })
}
</script>
