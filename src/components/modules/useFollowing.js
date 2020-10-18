import { computed, reactive } from 'vue'

export default chara => {
  const targetPosition = reactive({
    x: null,
    y: null
  })
  let resolver = null
  const setTargetPosition = (x, y) => {
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
  const hasTargetPosition = computed(() => targetPosition.x !== null && targetPosition.y !== null)
  const diffToTargetPositionX = computed(() => hasTargetPosition.value ? targetPosition.x - chara.value.x : 0)
  const diffToTargetPositionY = computed(() => hasTargetPosition.value ? targetPosition.y - chara.value.y : 0)
  const diffToTargetPositionDistance = computed(() => Math.hypot(diffToTargetPositionX.value, diffToTargetPositionY.value))
  const walkToTargetPosition = speed => {
    if (!hasTargetPosition.value) return
    const diffX = diffToTargetPositionX.value
    const diffY = diffToTargetPositionY.value
    const body = chara.value.body
    const x = (!body.blocked.left && !body.blocked.right) ? diffX : diffX * 0.1
    const y = (!body.blocked.top && !body.blocked.down) ? diffY : diffY * 0.1
    body.setVelocity(x, y)
    const spd = Math.min(speed, diffToTargetPositionDistance.value * 10)
    body.velocity.normalize().scale(spd)
    if (diffToTargetPositionDistance.value < 5) clearTargetPosition()
  }
  return {
    targetPosition,
    setTargetPosition,
    clearTargetPosition,
    hasTargetPosition,
    diffToTargetPositionX,
    diffToTargetPositionY,
    diffToTargetPositionDistance,
    walkToTargetPosition
  }
}
