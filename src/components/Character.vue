<template>
  <div>
    <Container ref="object" :width="imgWidth" :height="imgWidth" :x="initX" :y="initY" @create="create" @preUpdate="update">
      <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" />
    </Container>
    <Container v-if="tapEvent" ref="event" :width="imgWidth + 15" :height="imgHeight + 40" :depth="100000" @pointerdown="onTap">
      <Image texture="speach_bubbles" :y="-20" :frame="1" @create="initBubbleAnim" />
    </Container>
  </div>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import useRandomWalk from './modules/useRandomWalk'
import useFollowing from './modules/useFollowing'
import useFrameAnim from './modules/useFrameAnim'
import { ref, computed, inject, onMounted, reactive } from 'vue'
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
  emits: ['create'],
  setup (props, context) {
    const scene = inject('scene')
    const object = refObj(null)
    const image = refObj(null)
    const event = refObj(null)
    const following = useFollowing(object)
    const randomWalk = props.random ? useRandomWalk(object, 100) : null
    const frameAnim = useFrameAnim(WALK_ANIM, image)
    const imgWidth = computed(() => image.value ? image.value.width : 0)
    const imgHeight = computed(() => image.value ? image.value.height : 0)
    const data = reactive({
      directionKey: velocityToDirectionKey(Math.cos(props.initR), Math.sin(props.initR))
    })
    const tapEvent = ref(null)
    const setTapEvent = event => tapEvent.value = event
    const onTap = () => tapEvent.value && tapEvent.value()
    const create = obj => context.emit('create', obj)
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
      if (event.value) event.value.setPosition(obj.x, obj.y - imgHeight.value.half - 10)
    }
    onMounted((a) => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    const initBubbleAnim = obj => {
      scene.add.tween({
        targets: obj, y: -24, yoyo: true, repeat: -1, duration: 500
      })
    }
    return {
      object, image, event,
      create, update,
      onTap, tapEvent, setTapEvent,
      following,
      initBubbleAnim,
      imgWidth, imgHeight
    }
  }
}
</script>
