<template>
  <Container :x="0" :y="0" v-if="talk.current">
    <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="talk.next" />
    <Container :x="x" :y="y">
      <Rectangle ref="bg" :origin="0.5" :fillColor="0x222222" :alpha="0.8" :width="bgSize.width" :height="bgSize.height" :displayOriginX="bgSize.width / 2" :displayOriginY="bgSize.height / 2" />
      <Text ref="name" :text="talk.current.talker.name" :style="{ fontSize: 15, fontStyle: 'bold', color: '#FFFFFF', stroke: '#111111', strokeThickness: 3 }" :originX="0" :originY="1" :x="-(bgSize.width / 2) + 8" :y="-(bgSize.height / 2) + 8" />
      <Text :key="talk.current.message" :text="talk.current.message" :style="{ fontSize: 14, fontStyle: 'normal', color: '#FFFFFF' }" :origin="0.5" @create="onCreate" />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import InjectionKeys from './modules/InjectionKeys'
import config from '../data/config'
import { Container, Rectangle, Text, useScene } from 'phavuer'
import { GameObjects } from 'phaser'

const scene = useScene()
const camera = scene.cameras.main
const talk = inject(InjectionKeys.Talk)!
const x = computed(() => talk.current.talker.pos.x - camera.scrollX)
const y = computed(() => talk.current.talker.pos.y - camera.scrollY - 70)
const bgSize = reactive({
  width: 0,
  height: 0
})
const onCreate = (v: GameObjects.Text) => {
  bgSize.width = Math.max(v.width + 20, 100)
  bgSize.height = v.height + 20
}
// import { refObj, Container, Rectangle, Text, useScene } from 'phavuer'
// import { computed, ref, onUpdated, reactive, toRefs } from 'vue'
// import config from '../data/config'
// export default {
//   components: { Container, Rectangle, Text },
//   setup () {
//     const scene = useScene()
//     // inject
//     const camera = scene.cameras.main
//     // refs
//     const bg = refObj()
//     const txt = refObj()
//     // data
//     const list = ref([])
//     const current = computed(() => list.value[0])
//     let resolver = null
//     const data = reactive({
//       x: computed(() => current.value?.chara.x - camera.scrollX),
//       y: computed(() => current.value?.chara.y - camera.scrollY - 70),
//       bgWidth: 0,
//       bgHeight: 0
//     })
//     const setTalk = array => {
//       if (resolver) resolver()
//       list.value.splice(0)
//       return new Promise(resolve => {
//         list.value.push(...array)
//         resolver = resolve
//       })
//     }
//     const next = (pointer) => {
//       pointer.isDown = false
//       list.value.splice(0, 1)
//       if (!list.value.length && resolver) resolver()
//     }
//     onUpdated(() => {
//       if (!current.value) return
//       data.bgWidth = Math.max(txt.value.width + 20, 100)
//       data.bgHeight = txt.value.height + 20
//     })
//     return {
//       config,
//       current,
//       next,
//       setTalk,
//       bg, txt,
//       ...toRefs(data)
//     }
//   }
// }
</script>
