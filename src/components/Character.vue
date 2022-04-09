<template>
  <div>
    <Container ref="object" :width="imgWidth" :height="imgWidth" :x="initX" :y="initY" @create="create">
      <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" :pipeline="pipeline" />
    </Container>
    <TapArea v-if="tapEvent.event.value" :visible="checkable" :frame="1" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="tapEvent.exec" />
  </div>
</template>

<script>
import { refObj, Container, Image, onPreUpdate, useScene } from 'phavuer'
import { computed, inject, onMounted, reactive, toRefs } from 'vue'
import TapArea from './TapArea.vue'
import useRandomWalk from './modules/useRandomWalk'
import useFollowing from './modules/useFollowing'
import useFrameAnim from './modules/useFrameAnim'
import useEvent from './modules/useEvent'
const WALK_ANIM = [
  { key: 'down', frames: [1, 0, 1, 2], duration: 7 },
  { key: 'left', frames: [4, 3, 4, 5], duration: 7 },
  { key: 'right', frames: [7, 6, 7, 8], duration: 7 },
  { key: 'up', frames: [10, 9, 10, 11], duration: 7 }
]
const BASE_FRAME = { down: 1, left: 4, right: 7, up: 10 }
const velocityToDirectionKey = (x, y) => {
  if (Math.round(Math.abs(x)) > Math.round(Math.abs(y))) return x < 0 ? 'left' : 'right'
  return y < 0 ? 'up' : 'down'
}
export default {
  components: { Container, Image, TapArea },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 },
    name: { default: null },
    speed: { default: 120 },
    random: { default: null },
    pipeline: { default: null }
  },
  emits: ['create'],
  setup (props, context) {
    const scene = useScene()
    const event = inject('event')
    const player = inject('player')
    const object = refObj(null)
    const image = refObj(null)
    const tapEvent = useEvent()
    const following = useFollowing(object)
    const randomWalk = props.random ? useRandomWalk(object, 100) : null
    const frameAnim = useFrameAnim(WALK_ANIM, image)
    const imgWidth = computed(() => image.value ? image.value.width : 0)
    const imgHeight = computed(() => image.value ? image.value.height : 0)
    const data = reactive({
      distanceToPlayer: null,
      directionKey: velocityToDirectionKey(Math.cos(props.initR), Math.sin(props.initR))
    })
    const create = obj => context.emit('create', obj)
    onPreUpdate(() => {
      if (event.state) {
        image.value.setFrame(BASE_FRAME[data.directionKey])
        return
      }
      data.distanceToPlayer = Phaser.Math.Distance.Between(object.value.x, object.value.y, player.value.object.x, player.value.object.y)
      object.value.setDepth(object.value.y)
      const velocity = Math.hypot(object.value.body.velocity.x, object.value.body.velocity.y)
      if (randomWalk) randomWalk.play(pos => following.setTargetPosition(pos.x, pos.y))
      following.walkToTargetPosition(props.speed)
      if (velocity > 1) {
        data.directionKey = velocityToDirectionKey(object.value.body.velocity.x, object.value.body.velocity.y)
        frameAnim.play(data.directionKey)
      } else {
        image.value.setFrame(BASE_FRAME[data.directionKey])
      }
    })
    onMounted((a) => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    return {
      ...toRefs(data),
      checkable: computed(() => !event.state && tapEvent.event.value && data.distanceToPlayer < 150),
      object, image,
      create,
      following,
      imgWidth, imgHeight,
      tapEvent, setTapEvent: tapEvent.setEvent
    }
  }
}
</script>
