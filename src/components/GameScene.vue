<template>
  <Scene name="GameScene" :autoStart="true" @preload="preload" v-slot="{ preloaded }">
    <Field v-if="preloaded && fieldManager.key" :key="fieldManager.key" />
    <Talk />
  </Scene>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { Scene } from 'phavuer'
import Field from './Field.vue'
import assets from '../data/assets.json'
import InjectionKeys from './modules/InjectionKeys'
import Talk from './Talk.vue'

const fieldManager = inject(InjectionKeys.FieldManager)!
const preload = (scene: Phaser.Scene) => {
  Object.entries(assets).forEach(([method, list]) => {
    list.forEach(args => scene.load[method](...args))
  })
}
</script>
