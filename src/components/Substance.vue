<template>
  <div>
    <Container ref="object" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="initY">
      <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" v-if="name" :pipeline="pipeline" />
    </Container>
    <TapArea v-if="tapEvent.event.value" :visible="checkable" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="tapEvent.exec" />
  </div>
</template>

<script>
import { refObj, Container, Image, onPreUpdate } from 'phavuer'
import { computed, inject, reactive, toRefs } from 'vue'
import TapArea from './TapArea.vue'
import useEvent from './modules/useEvent'
export default {
  components: { Container, Image, TapArea },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    name: { default: null },
    pipeline: { default: null }
  },
  setup (props) {
    const event = inject('event')
    const player = inject('player')
    const object = refObj(null)
    const image = refObj(null)
    const imgWidth = computed(() => image.value ? image.value.width : 30)
    const imgHeight = computed(() => image.value ? image.value.height : 30)
    const tapEvent = useEvent()
    const data = reactive({
      distanceToPlayer: null
    })
    onPreUpdate(() => {
      data.distanceToPlayer = Phaser.Math.Distance.Between(object.value.x, object.value.y, player.value.object.x, player.value.object.y)
    })
    return {
      ...toRefs(data),
      checkable: computed(() => !event.state && tapEvent.event.value && data.distanceToPlayer < 150),
      object, image,
      imgWidth, imgHeight,
      tapEvent, setTapEvent: tapEvent.setEvent
    }
  }
}
</script>
