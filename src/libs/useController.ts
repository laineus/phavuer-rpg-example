import { proxyRefs, ref } from 'vue'

export default () => {
  const velocityX = ref(0)
  const velocityY = ref(0)
  return proxyRefs({
    velocityX,
    velocityY
  })
}
