<template>
  <div>
    <TilemapLayer v-for="v in field.layers" :key="v.index" :depth="v.depth ?? 0" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" :collision="field.collides" :lighting="lighting" @create="layerCreate" />
    <LayerImage v-for="v in field.images" :key="v.id" :imageLayerData="v" />
    <Player :character="field.player" :lighting="lighting" />
    <Character v-for="v in field.characters" :key="v.id" :character="v" :lighting="lighting" />
    <Substance v-for="v in field.substances" :key="v.id" :substance="v" :lighting="lighting" />
    <Area v-for="v in field.areas" :key="v.id" :area="v" />
    <Gate v-for="v in field.gates" :key="v.id" :gate="v" />
    <Light v-for="v in field.lights" :key="v.id" :x="v.x" :y="v.y" :intensity="v.intensity ?? 1" :color="v.color" :radius="v.radius" />
    <Darkness />
  </div>
</template>

<script lang="ts" setup>
import Character from './Character.vue'
import Substance from './Substance.vue'
import Area from './Area.vue'
import Gate from './Gate.vue'
import Darkness from './Darkness.vue'
import { computed, inject, onMounted, provide } from 'vue'
import { TilemapLayer, Light, useScene } from 'phavuer'
import Player from './Player.vue'
import LayerImage from './LayerImage.vue'
import InjectionKeys from '../libs/InjectionKeys'
import useField from '../libs/useField'
import getMapConfig from '../data/maps'
const scene = useScene()
const audio = inject(InjectionKeys.Audio)
const fieldManager = inject(InjectionKeys.FieldManager)!
const field = useField(fieldManager.key!, { x: fieldManager.initialX, y: fieldManager.initialY })
provide(InjectionKeys.Field, field)
console.log(field)
scene.lights.setAmbientColor(field.properties.ambient || 0xFFFFFF)
field.lights.length ? scene.lights.enable() : scene.lights.disable()
const lighting = computed(() => field.lights.length > 0)
const group = scene.add.group()
provide(InjectionKeys.ColliderGroup, group)
const layerCreate = (layer: Phaser.Tilemaps.TilemapLayer) => {
  scene.physics.add.collider(layer, group)
}
const mapConfig = getMapConfig(fieldManager.key!)
mapConfig?.create(field)
onMounted(() => {
  audio?.playBgm(mapConfig?.bgm || null)
})
</script>
