<template>
  <div />
</template>

<script>
import { inject } from 'vue'
import { initGameObject } from 'phavuer'
export default {
  setup (props, context) {
    const scene = inject('scene')
    class StaticTilemapLayer extends Phaser.Tilemaps.StaticTilemapLayer {
      preUpdate () {}
    }
    const object = new StaticTilemapLayer(scene, props.tilemap, props.layerIndex, props.tileset, props.x, props.y)
    initGameObject(object, props, context)
    return { object }
  },
  props: [
    'visible',
    'x', 'y',
    'width', 'height',
    'depth',
    'tilemap', 'layerIndex', 'tileset'
  ]
}
</script>
