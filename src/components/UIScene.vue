<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update" v-slot="{ preloaded }">
    <template v-if="preloaded">
      <Title @close="titleScreen = false" v-if="titleScreen" />
      <template v-else>
        <Controller ref="controller" />
        <Circle :visible="isMobile && nealestCheckable" :radius="80" :fillColor="0x000000" :alpha="0.5" :x="(100).byRight" :y="(100).byBottom" @pointerdown="check" />
      </template>
      <Rectangle :fillColor="0x000000" :origin="0" :width="constants.WIDTH" :height="constants.HEIGHT" :depth="constants.DEPTH.TRANSITION" :alpha="transitionAlpha" />
    </template>
  </Scene>
</template>

<script lang="ts">
import { inject, ref } from 'vue'
import { refScene, Scene, Rectangle, Circle } from 'phavuer'
import Title from './Title.vue'
import Controller from './Controller.vue'
import constants from '../data/constants'
import InjectionKeys from '../libs/InjectionKeys'
export default {
  components: { Scene, Title, Controller, Rectangle, Circle },
  setup (props) {
    const isMobile = inject(InjectionKeys.Mobile)!
    const scene = refScene(null)
    const titleScreen = ref(true)
    const transitionAlpha = ref(0)
    const nealestCheckable = ref(null)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      // nealestCheckable.value = field.value.charas.concat(field.value.substances).map(v => v.ref.value[0]).filter(v => v.checkable).findMin(v => v.distanceToPlayer)
    }
    const transition = (duration = 500) => {
      return new Promise(resolve => {
        transitionAlpha.value = 0
        scene.value.add.tween({ targets: transitionAlpha, duration, hold: duration.half, value: 1, yoyo: true, onYoyo: resolve })
      })
    }
    return {
      isMobile,
      constants,
      create, update,
      scene, controller: ref(null), talk: ref(null),
      titleScreen,
      transition,
      transitionAlpha,
      nealestCheckable,
      check: () => {
        if (!nealestCheckable.value) return
        nealestCheckable.value.tapEvent.exec()
      }
    }
  }
}
</script>
