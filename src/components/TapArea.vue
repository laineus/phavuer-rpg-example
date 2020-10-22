<template>
  <Container ref="tapArea" :visible="!event.state && closeToPlayer" :depth="100000" @pointerdown="onTap" @preUpdate="update">
    <Image texture="speach_bubbles" :y="-20" :frame="frame" @create="initBubbleAnim" />
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { inject, ref } from 'vue'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    frame: { default: 0 }
  },
  emits: ['tap'],
  setup (props, context) {
    const scene = inject('scene')
    const event = inject('event')
    const player = inject('player')
    const tapArea = refObj(null)
    const closeToPlayer = ref(false)
    const onTap = () => context.emit('tap')
    const initBubbleAnim = obj => {
      scene.add.tween({ targets: obj, y: -24, yoyo: true, repeat: -1, duration: 500 })
    }
    const update = () => {
      if (props.follow) tapArea.value.setPosition(props.follow.x, props.follow.y - tapArea.value.height.half + 10)
      closeToPlayer.value = Phaser.Math.Distance.Between(tapArea.value.x, tapArea.value.y, player.value.object.x, player.value.object.y) < 150
    }
    return {
      event,
      tapArea,
      onTap, update, initBubbleAnim,
      closeToPlayer
    }
  }
}
</script>
