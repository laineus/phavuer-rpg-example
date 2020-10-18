<template>
  <Container ref="chara" :x="initX" :y="initY" @create="create" @update="update">
    <Image :texture="`chara_sprite/${name}`" :origin="0" />
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import useRandomWalk from './modules/useRandomWalk'
import useFollowing from './modules/useFollowing'
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
    const following = useFollowing(chara)
    const randomWalk = useRandomWalk(chara, 100)
    const create = obj => {
      obj.scene.physics.world.enable(obj)
    }
    const update = obj => {
      randomWalk.play(pos => following.setTargetPosition(pos.x, pos.y))
      following.walkToTargetPosition(props.speed)
    }
    return {
      chara,
      create,
      update
    }
  }
}
</script>
