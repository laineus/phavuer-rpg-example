import { ref, reactive } from 'vue'

export default (chara: { x: number, y: number }) => {
  const targetPosition = reactive<{
    x: null
    y: null
  } | {
    x: number
    y: number
  }>({
    x: null,
    y: null
  })
  const targetObject = ref<{ x: number, y: number } | null>(null)
  const setTargetObject = (object: { x: number, y: number }) => targetObject.value = object
  let resolver: ((value?: unknown) => void) | null = null
  const setTargetPosition = (x: number, y: number) => {
    targetPosition.x = x
    targetPosition.y = y
    return new Promise(resolve => {
      resolver = resolve
    })
  }
  const clearTargetPosition = () => {
    targetPosition.x = null
    targetPosition.y = null
    if (resolver) resolver()
  }
  const play = () => {
    if (targetObject.value) setTargetPosition(targetObject.value.x, targetObject.value.y)
    if (!targetPosition.x) return
    const diffX = targetPosition.x - chara.x
    const diffY = targetPosition.y - chara.y
    const distance = Math.hypot(diffX, diffY)
    const speed = 150
    if (targetObject.value ? distance < 50 : distance < 5) return clearTargetPosition()
    return {
      x: diffX * speed / distance,
      y: diffY * speed / distance
    }
  }
  return {
    setTargetPosition,
    clearTargetPosition,
    setTargetObject,
    play
  }
}
