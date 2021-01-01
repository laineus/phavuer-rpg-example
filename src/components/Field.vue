<template>
  <div>
    <TilemapLayer v-for="v in layers" :key="v.index" :ref="v.ref" :depth="config.DEPTH[v.depth] || 0" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" :collision="collides" :pipeline="pipeline" @create="layerCreate" />
    <Image v-for="v in images" :key="v.id" :ref="v.ref" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" :pipeline="pipeline" @create="obj => obj.setDepth(obj.y + obj.height)" />
    <Character ref="player" :initX="playerX" :initY="playerY" :initR="playerR" :speed="200" name="player" :pipeline="pipeline" @create="charaCreate" />
    <Character v-for="v in charas" :key="v.id" :ref="v.ref" :initX="v.x" :initY="v.y" :initR="v.radian" :name="v.name" :random="100" :pipeline="pipeline" @create="charaCreate" />
    <Substance v-for="v in substances" :key="v.id" :ref="v.ref" :initX="v.x" :initY="v.y" :name="v.name" :pipeline="pipeline" />
    <Area v-for="v in areas" :key="v.id" :x="v.x" :y="v.y" :width="v.width" :height="v.height" />
    <Gate v-for="v in gates" :key="v.id" :x="v.x" :y="v.y" :width="v.width" :height="v.height" :to="{ key: v.name, x: v.fieldX.toPixel, y: v.fieldY.toPixel }" />
    <Light v-for="v in lights" :key="v.id" :x="v.x" :y="v.y" :intensity="v.intensity || 1" :color="v.color" :radius="v.radius" />
  </div>
</template>

<script>
import fieldService from './modules/fieldService'
import Character from './Character'
import Substance from './Substance'
import Area from './Area'
import Gate from './Gate'
import { computed, inject, onMounted, ref } from 'vue'
import { refObj, Image, TilemapLayer, Light } from 'phavuer'
import setupCamera from './modules/setupCamera'
import maps from '@/data/maps'
import config from '@/data/config'
export default {
  components: { TilemapLayer, Image, Character, Substance, Area, Gate, Light },
  props: [
    'fieldKey', 'playerX', 'playerY', 'playerR'
  ],
  setup (props) {
    const scene = inject('scene')
    const audio = inject('audio')
    const player = ref(null)
    const field = fieldService(scene, props.fieldKey)
    console.log(field)
    const layers = field.layers.map(v => Object.assign({ ref: refObj(null) }, v))
    const images = field.images.map(v => Object.assign({ ref: refObj(null) }, v))
    const objects = field.objects.map(v => Object.assign({ ref: ref(null) }, v))
    const charas = objects.filter(v => v.type === 'Character')
    const substances = objects.filter(v => v.type === 'Substance')
    const areas = objects.filter(v => v.type === 'Area')
    const gates = objects.filter(v => v.type === 'Gate')
    const lights = objects.filter(v => v.type === 'Light')
    scene.lights.setAmbientColor(field.properties.ambient || 0xFFFFFF)
    lights.length ? scene.lights.enable() : scene.lights.disable()
    const pipeline = computed(() => lights.length ? 'Light2D' : 'TextureTintPipeline')
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
    const event = maps[props.fieldKey] || {}
    onMounted(() => {
      setupCamera(inject('camera').value, field.width, field.height, player.value.object)
      if (event.create) event.create()
      audio.setBgm(event.bgm || null)
    })
    const update = (time) => {
      field.update(time)
      if (event.update) event.update()
    }
    return {
      config,
      field, collides,
      width: field.width, height: field.height,
      layers, images, player, objects, charas, substances, areas, gates, lights,
      pipeline,
      isCollides, getObjectById,
      layerCreate, charaCreate,
      play: update
    }
  }
}
</script>
