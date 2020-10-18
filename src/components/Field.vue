<template>
  <div>
    <component v-for="v in layers" :key="v.index" :is="v.component" :ref="v.ref" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" />
    <Image v-for="v in field.images" :key="v.id" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" />
    <Character v-for="v in field.objects.filter(v => v.type === 'Character')" :key="v.id" :initX="v.x" :initY="v.y" :name="v.name" />
  </div>
</template>

<script>
import StaticTilemapLayer from './StaticTilemapLayer'
import DynamicTilemapLayer from './DynamicTilemapLayer'
import fieldService from './modules/fieldService'
import Character from './Character'
import { inject } from 'vue'
import { refObj, Image } from 'phavuer'
export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
const repositoryRow = data => Object.assign({ ref: refObj(null) }, data)
export default {
  components: { StaticTilemapLayer, DynamicTilemapLayer, Image, Character },
  props: [
    'mapKey'
  ],
  setup (props) {
    const scene = inject('scene')
    const field = fieldService(scene, props.mapKey)
    console.log(field)
    const layers = field.layers.map(repositoryRow)
    const isCollides = (tileX, tileY) => {
      return layers.some(layer => {
        const tile = layer.ref.value.getTileAt(tileX, tileY)
        return tile && tile.collides
      })
    }
    return {
      field,
      layers,
      isCollides,
      play: field.update
    }
  }
}
</script>
