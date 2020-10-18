<template>
  <Container :x="x" :y="y" @update="update">
    <Image :texture="`chara_sprite/${name}`" :origin="0" />
  </Container>
</template>

<script>
import { Container, Image } from 'phavuer'
import { reactive, toRefs } from 'vue'
import useRandomWalk from './modules/useRandomWalk'
export default {
  components: { Container, Image },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 },
    name: { default: null },
    speed: { default: 120 }
  },
  setup (props) {
    const data = reactive({
      x: props.initX,
      y: props.initY,
      r: props.initR,
      targetX: 0,
      targetY: 0
    })
    const randomWalk = useRandomWalk(data, 100)
    const update = () => {
      randomWalk.play(pos => {
        data.targetX = pos.x
        data.targetY = pos.y
      })
    }
    return {
      ...toRefs(data),
      update
    }
  }
}
</script>
