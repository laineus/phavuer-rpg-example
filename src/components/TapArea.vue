<template>
  <Container ref="tapArea" :depth="100000" @pointerdown="onTap">
    <Image texture="speach_bubbles" :y="-20" :frame="frame" @create="initBubbleAnim" />
  </Container>
</template>

<script>
import { refObj, Container, Image, onPreUpdate, useScene } from 'phavuer'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    frame: { default: 0 }
  },
  emits: ['tap'],
  setup (props, context) {
    const scene = useScene()
    const tapArea = refObj(null)
    const onTap = () => context.emit('tap')
    const initBubbleAnim = obj => {
      scene.add.tween({ targets: obj, y: -24, yoyo: true, repeat: -1, duration: 500 })
    }
    onPreUpdate(() => {
      if (props.follow) tapArea.value.setPosition(props.follow.x, props.follow.y - tapArea.value.height.half + 10)
    })
    return {
      tapArea,
      onTap, initBubbleAnim
    }
  }
}
</script>
