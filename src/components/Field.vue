<template>
  <div>
    <component v-for="v in field.layers" :key="v.index" :is="v.component" :depth="v.depth" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" />
  </div>
</template>

<script>
import StaticTilemapLayer from './StaticTilemapLayer'
import DynamicTilemapLayer from './DynamicTilemapLayer'
import FieldService from './FieldService'
import { inject } from 'vue'
export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
export default {
  components: { StaticTilemapLayer, DynamicTilemapLayer },
  props: [
    'mapKey'
  ],
  setup (props) {
    const scene = inject('scene')
    const field = new FieldService(scene, props.mapKey)
    return {
      field,
      play: field.update
    }
  }
}
</script>
