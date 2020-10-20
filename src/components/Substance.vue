<template>
  <Container ref="object" :x="initX" :y="initY" :width="32" :height="32" @create="create" @preUpdate="update">
    <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" v-if="name" />
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { onMounted } from 'vue'
export default {
  components: { Container, Image },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    name: { default: null }
  },
  setup (props) {
    const object = refObj(null)
    const image = refObj(null)
    const create = obj => {
      obj.setDepth(obj.y)
    }
    const update = obj => {
    }
    onMounted(() => {
      if (image.value) object.value.setSize(image.value.width, image.value.height)
    })
    return {
      object, image,
      create, update
    }
  }
}
</script>
