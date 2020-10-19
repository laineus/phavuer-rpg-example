<template>
  <div>
    <component v-for="v in layers" :key="v.index" :is="v.component" :ref="v.ref" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" :collision="collides" @create="layerCreate" />
    <Image v-for="v in field.images" :key="v.id" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" @create="obj => obj.setDepth(obj.y + obj.height)" />
    <Character ref="player" :initX="playerX" :initY="playerY" :initR="playerR" :speed="200" name="player" @create="charaCreate" />
    <Character v-for="v in charas" :key="v.id" :ref="v.ref" :initX="v.x" :initY="v.y" :initR="v.radian" :name="v.name" :random="100" @create="charaCreate" />
    <Substance v-for="v in substances" :key="v.id" :ref="v.ref" :initX="v.x" :initY="v.y" :name="v.name" />
  </div>
</template>

<script>
import fieldService from './modules/fieldService'
import Character from './Character'
import Substance from './Substance'
import { inject, ref } from 'vue'
import { refObj, Image, StaticTilemapLayer, DynamicTilemapLayer } from 'phavuer'
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
  components: { StaticTilemapLayer, DynamicTilemapLayer, Image, Character, Substance },
  props: [
    'mapKey', 'playerX', 'playerY', 'playerR'
  ],
  setup (props) {
    const scene = inject('scene')
    const player = ref(null)
    const field = fieldService(scene, props.mapKey)
    console.log(field)
    const layers = field.layers.map(repositoryRow)
    const charas = field.getObjectsByType('Character').map(repositoryRow)
    const substances = field.getObjectsByType('Substance').map(repositoryRow)
    const isCollides = (tileX, tileY) => {
      return layers.some(layer => {
        const tile = layer.ref.value.getTileAt(tileX, tileY)
        return tile && tile.collides
      })
    }
    const collides = field.getTileSettingsByType('collides').map(v => v.id)
    const group = scene.add.group()
    const layerCreate = layer => {
      scene.physics.add.collider(layer, group)
    }
    const charaCreate = obj => {
      group.add(obj)
    }
    return {
      field,
      width: field.width,
      height: field.height,
      layers,
      player,
      charas,
      substances,
      collides,
      isCollides,
      layerCreate,
      charaCreate,
      play: field.update
    }
  }
}
</script>
