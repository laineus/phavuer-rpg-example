<template>
  <Container ref="object" :x="initX" :y="initY" @create="create" @update="update">
    <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" />
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import useRandomWalk from './modules/useRandomWalk'
import useFollowing from './modules/useFollowing'
import useFrameAnim from './modules/useFrameAnim'
import { onMounted, reactive } from 'vue'
const WALK_ANIM = [
  { key: 'down', frames: [1, 0, 1, 2], duration: 7 },
  { key: 'left', frames: [4, 3, 4, 5], duration: 7 },
  { key: 'right', frames: [7, 6, 7, 8], duration: 7 },
  { key: 'up', frames: [10, 9, 10, 11], duration: 7 }
]
const BASE_FRAME = { down: 1, left: 4, right: 7, up: 10 }
const velocityToDirectionKey = (x, y) => {
  if (Math.abs(x) > Math.abs(y)) return x < 0 ? 'left' : 'right'
  return y < 0 ? 'up' : 'down'
}
export default {
  components: { Container, Image },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 },
    name: { default: null },
    speed: { default: 120 },
    random: { default: null }
  },
  setup (props) {
    const object = refObj(null)
    const image = refObj(null)
    const following = useFollowing(object)
    const randomWalk = props.random ? useRandomWalk(object, 100) : null
    const frameAnim = useFrameAnim(WALK_ANIM, image)
    const data = reactive({
      directionKey: velocityToDirectionKey(Math.cos(props.initR), Math.sin(props.initR))
    })
    const create = obj => {
    }
    const update = obj => {
      obj.setDepth(obj.y)
      const velocity = Math.hypot(object.value.body.velocity.x, object.value.body.velocity.y)
      if (randomWalk) randomWalk.play(pos => following.setTargetPosition(pos.x, pos.y))
      following.walkToTargetPosition(props.speed)
      if (velocity > 1) {
        data.directionKey = velocityToDirectionKey(object.value.body.velocity.x, object.value.body.velocity.y)
        frameAnim.play(data.directionKey)
      } else {
        image.value.setFrame(BASE_FRAME[data.directionKey])
      }
    }
    onMounted(() => {
      object.value.setSize(image.value.width, image.value.height)
      object.value.scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    return {
      object, image,
      create, update,
      following
    }
  }
}
</script>
