<template>
  <div>
    <Container ref="object" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="initY">
      <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" v-if="name" />
    </Container>
    <TapArea v-if="image" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="onTap" />
  </div>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { computed } from 'vue'
import TapArea from './TapArea'
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
    const imgWidth = computed(() => image.value ? image.value.width : 0)
    const imgHeight = computed(() => image.value ? image.value.height : 0)
    const onTap = () => {
      console.log('tap')
    }
    console.log(object)
    return {
      object, image,
      imgWidth, imgHeight,
      onTap
    }
  }
}
</script>
