<template>
  <div>
    <component v-for="v in field.layers" :key="v.index" :is="v.component" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" />
    <Image v-for="v in characters" :key="v.id" :texture="`chara_sprite/${v.name}`" :x="v.x" :y="v.y" />
    <Image v-for="v in field.images" :key="v.id" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" />
  </div>
</template>

<script>
import StaticTilemapLayer from './StaticTilemapLayer'
import DynamicTilemapLayer from './DynamicTilemapLayer'
import FieldService from './FieldService'
import { inject } from 'vue'
import { Image } from 'phavuer'
export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
export default {
  components: { StaticTilemapLayer, DynamicTilemapLayer, Image },
  props: [
    'mapKey'
  ],
  setup (props) {
    const scene = inject('scene')
    const field = new FieldService(scene, props.mapKey)
    console.log(field.layers)
    console.log(field.images)
    const characters = field.getObjectsByType('Character').map(data => {
      return Object.assign(data, { r: (data.rotation + 90) * (Math.PI / 180) })
    })
    return {
      field,
      characters,
      play: field.update
    }
  }
}
</script>
