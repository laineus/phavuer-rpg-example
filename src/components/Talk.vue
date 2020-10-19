<template>
  <Container :x="0" :y="0" v-if="current">
    <Rectangle :origin="0" :width="960" :height="540" @pointerdown="next" />
    <Text :style="{ fontSize: 20, fontStyle: 'bold', color: '#FFFFFF' }">aaaaaaaaa{{ current.text }}</Text>
  </Container>
</template>

<script>
import { Container, Rectangle, Text } from 'phavuer'
import { computed, ref } from 'vue'
export default {
  components: { Container, Rectangle, Text },
  setup () {
    const list = ref([])
    const current = computed(() => list.value[0])
    list.value.push(...[
      { text: 'aaaaaaaaa' },
      { text: 'bbbb' },
      { text: 'ccccc' }
    ])
    let resolver = null
    const setText = array => {
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
    return {
      current,
      next,
      setText
    }
  }
}
</script>
