<template>
  <Container ref="chara" :x="initX" :y="initY" @create="create" @update="update">
    <Image ref="image" :texture="`chara_sprite/${name}`" :originX="0.5" :originY="1" />
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import useRandomWalk from './modules/useRandomWalk'
import useFollowing from './modules/useFollowing'
import useFrameAnim from './modules/useFrameAnim'
import { onMounted } from 'vue'
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
    const chara = refObj(null)
    const image = refObj(null)
    const following = useFollowing(chara)
    const randomWalk = useRandomWalk(chara, 100)
    const frameAnim = useFrameAnim([{ key: 'walk', frames: [1, 0, 1, 2], duration: 20 }], image)
    const create = obj => {
    }
    const update = obj => {
      randomWalk.play(pos => following.setTargetPosition(pos.x, pos.y))
      following.walkToTargetPosition(props.speed)
      frameAnim.play('walk')
    }
    onMounted(() => {
      chara.value.setSize(image.value.width, image.value.height)
      chara.value.scene.physics.world.enable(chara.value)
    })
    return {
      chara, image,
      create,
      update
    }
  }
}
</script>
