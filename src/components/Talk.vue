<template>
  <Container :x="0" :y="0" v-if="current">
    <Rectangle :origin="0" :width="960" :height="540" @pointerdown="next" />
    <Container :x="current.chara.object.x - camera.scrollX" :y="current.chara.object.y - camera.scrollY - 70">
      <Rectangle ref="bg" :origin="0.5" :fillColor="0x222222" :alpha="0.8" />
      <Text ref="txt" :style="{ fontSize: 14, fontStyle: 'bold', color: '#FFFFFF' }" :origin="0.5" />
    </Container>
  </Container>
</template>

<script>
import { refObj, Container, Rectangle, Text } from 'phavuer'
import { computed, ref, inject, onUpdated, onMounted } from 'vue'
export default {
  components: { Container, Rectangle, Text },
  setup () {
    const list = ref([])
    const bg = refObj()
    const txt = refObj()
    const current = computed(() => list.value[0])
    const player = inject('player')
    const camera = inject('camera')
    let resolver = null
    const updateSize = () => {
      if (!bg.value || !txt.value || !current.value) return
      txt.value.setText(current.value.text)
      const txtWidth = txt.value.width + 20
      const txtHeight = txt.value.height + 20
      bg.value.setSize(txtWidth, txtHeight)
      bg.value._displayOriginX = txtWidth.half
      bg.value._displayOriginY = txtHeight.half
    }
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
    onMounted(() => {
      updateSize()
    })
    onUpdated(() => {
      updateSize()
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
      bg, txt
    }
  }
}
</script>
