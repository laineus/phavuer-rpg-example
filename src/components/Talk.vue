<template>
  <Container :x="0" :y="0" v-if="current">
    <Rectangle :origin="0" :width="960" :height="540" @pointerdown="next" />
    <Container :x="current.chara.object.x - camera.scrollX" :y="current.chara.object.y - camera.scrollY - 70">
      <Rectangle ref="bg" :origin="0.5" :fillColor="0x222222" :alpha="0.8" :width="data.bgWidth" :height="data.bgHeight" />
      <Text ref="txt" :text="current.text" :style="{ fontSize: 14, fontStyle: 'bold', color: '#FFFFFF' }" :origin="0.5" />
    </Container>
  </Container>
</template>

<script>
import { refObj, Container, Rectangle, Text } from 'phavuer'
import { computed, ref, inject, onUpdated, reactive } from 'vue'
export default {
  components: { Container, Rectangle, Text },
  setup () {
    // inject
    const player = inject('player')
    const camera = inject('camera')
    // refs
    const bg = refObj()
    const txt = refObj()
    // data
    const list = ref([])
    const current = computed(() => list.value[0])
    let resolver = null
    const data = reactive({
      bgWidth: 0,
      bgHeight: 0
    })
    const setTalk = array => {
      if (resolver) resolver()
      list.value.splice(0)
      return new Promise(resolve => {
        list.value.push(...array)
        resolver = resolve
      })
    }
    const next = () => {
      list.value.splice(0, 1)
      if (!list.value.length && resolver) resolver()
    }
    onUpdated(() => {
      if (!current.value) return
      data.bgWidth = txt.value.width + 20
      data.bgHeight = txt.value.height + 20
      bg.value._displayOriginX = data.bgWidth.half
      bg.value._displayOriginY = data.bgHeight.half
    })
    setTimeout(() => {
      setTalk([
        { chara: player.value, text: 'aaaaaaaaaaaaaaaaaaa' },
        { chara: player.value, text: 'bbbb' },
        { chara: player.value, text: 'あいうえおか\nきくけこ' }
      ])
    }, 700)
    return {
      current,
      next,
      setTalk,
      camera,
      bg, txt,
      data
    }
  }
}
</script>
