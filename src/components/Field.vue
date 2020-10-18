<template>
  <div>
    <StaticTilemapLayer v-for="v in layers" :key="v.index" :depth="v.depth" :tilemap="tilemap" :layerIndex="v.index" :tileset="tilesets" />
  </div>
</template>

<script>
import { inject } from 'vue'
import StaticTilemapLayer from './StaticTilemapLayer'
export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
const getValueByProperties = (properties, key) => {
  if (!Array.isArray(properties)) return null
  const property = properties.find(v => v.name === key)
  return property ? property.value : null
}
// const animationTileSettings = this.getAllTileSettings(tilemap).filter(v => 'animation' in v.setting)
// const animationTileIds = animationTileSettings.map(v => v.id)
export default {
  components: { StaticTilemapLayer },
  props: [
    'mapKey'
  ],
  setup (props) {
    const scene = inject('scene')
    console.log(props)
    const data = scene.cache.tilemap.get(props.mapKey).data
    const tilemap = new Phaser.Tilemaps.ParseToTilemap(scene, props.mapKey)
    const tilesets = tilemap.tilesets.map(tileset => tilemap.addTilesetImage(tileset.name, `tileset/${tileset.name}`, 32, 32, 1, 2))
    const layers = tilemap.layers.map((layer, index) => {
      if (!layer.visible) return
      const dynamicFlag = getValueByProperties(layer.properties, 'dynamic')
      const hasAnimTile = true || layer.data.flat().some(v => animationTileIds.includes(v.index))
      const component = dynamicFlag || hasAnimTile ? 'DynamicTileLayer' : 'StaticTileLayer'
      const depthSetting = getValueByProperties(layer.properties, 'depth')
      const layerIndex = data.layers.findIndex(v => v.name === layer.name)
      const depth = (DEPTH[depthSetting] || DEPTH.GROUND) + layerIndex
      return { index, component, depth }
      return tilemap[typeName](i, tilesets, 0, 0).setDepth(depth)
    }).filter(Boolean)
    return {
      layers,
      tilesets,
      tilemap
    }
  }
}
</script>
