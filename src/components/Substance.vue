<template>
  <div>
    <Container ref="object" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="initY">
      <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" v-if="name" />
    </Container>
    <TapArea v-if="tapEvent.event.value" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="tapEvent.exec" />
  </div>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { computed } from 'vue'
import TapArea from './TapArea'
import useEvent from './modules/useEvent'
export default {
  components: { Container, Image, TapArea },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    name: { default: null }
  },
  setup (props) {
    const object = refObj(null)
    const image = refObj(null)
    const imgWidth = computed(() => image.value ? image.value.width : 30)
    const imgHeight = computed(() => image.value ? image.value.height : 30)
    const tapEvent = useEvent()
    return {
      object, image,
      imgWidth, imgHeight,
      tapEvent, setTapEvent: tapEvent.setEvent
    }
  }
}
</script>
