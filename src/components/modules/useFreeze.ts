import { computed, proxyRefs, ref } from 'vue'

export default () => {
  const locks = ref(new Set<symbol>())
  const freeze = () => {
    const key = Symbol()
    locks.value.add(key)
    return () => {
      locks.value.delete(key)
    }
  }
  const isFrozen = computed(() => locks.value.size > 0)
  const clear = () => {
    locks.value.clear()
  }
  return proxyRefs({
    freeze,
    isFrozen,
    clear
  })
}
