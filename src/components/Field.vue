<template>
  <div>
    <component v-for="v in layers" :key="v.index" :is="v.component" :ref="v.ref" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" :collision="collides" @create="layerCreate" />
    <Image v-for="v in images" :key="v.id" :ref="v.ref" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" @create="obj => obj.setDepth(obj.y + obj.height)" />
    <Character ref="player" :initX="playerX" :initY="playerY" :initR="playerR" :speed="200" name="player" @create="charaCreate" />
    <Character v-for="v in charas" :key="v.id" :ref="v.ref" :initX="v.x" :initY="v.y" :initR="v.radian" :name="v.name" :random="100" @create="charaCreate" />
    <Substance v-for="v in substances" :key="v.id" :ref="v.ref" :initX="v.x" :initY="v.y" :name="v.name" />
    <Area :x="400" :y="400" :width="300" :height="300" />
  </div>
</template>

<script>
import fieldService from './modules/fieldService'
import Character from './Character'
import Substance from './Substance'
import Area from './Area'
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
export default {
  components: { StaticTilemapLayer, DynamicTilemapLayer, Image, Character, Substance, Area },
  props: [
    'mapKey', 'playerX', 'playerY', 'playerR'
  ],
  setup (props) {
    const scene = inject('scene')
    const player = ref(null)
    const field = fieldService(scene, props.mapKey)
    console.log(field)
    const layers = field.layers.map(v => Object.assign({ ref: refObj(null) }, v))
    const images = field.images.map(v => Object.assign({ ref: refObj(null) }, v))
    const objects = field.objects.map(v => Object.assign({ ref: ref(null) }, v))
    const charas = objects.filter(v => v.type === 'Character')
    const substances = objects.filter(v => v.type === 'Substance')
    const isCollides = (tileX, tileY) => {
      return layers.some(layer => {
        const tile = layer.ref.value.getTileAt(tileX, tileY)
        return tile && tile.collides
      })
    }
    const getObjectById = id => objects.find(v => v.id === id)?.ref.value
    const collides = field.getTileSettingsByType('collides').map(v => v.id)
    const group = scene.add.group()
    const layerCreate = layer => {
      scene.physics.add.collider(layer, group)
    }
    const charaCreate = obj => {
      group.add(obj)
    }
    return {
      field, collides,
      width: field.width, height: field.height,
      layers, images, player, objects, charas, substances,
      isCollides, getObjectById,
      layerCreate, charaCreate,
      play: field.update
    }
  }
}
</script>
