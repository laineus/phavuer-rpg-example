import { computed, ref, reactive, unref } from 'vue'

export default chara => {
  const targetPosition = reactive({
    x: null,
    y: null
  })
  const targetObject = ref(null)
  const setTargetObject = object => targetObject.value = object
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
  const getDiffToTargetPositionX = () => hasTargetPosition.value ? targetPosition.x - unref(chara).x : 0
  const getDiffToTargetPositionY = () => hasTargetPosition.value ? targetPosition.y - unref(chara).y : 0
  const getDiffToTargetPositionDistance = (x, y) => Math.hypot(x || getDiffToTargetPositionX(), y || getDiffToTargetPositionY())
  const walkToTargetPosition = speed => {
    if (targetObject.value) setTargetPosition(targetObject.value.x, targetObject.value.y)
    if (!hasTargetPosition.value) return
    const diffX = getDiffToTargetPositionX()
    const diffY = getDiffToTargetPositionY()
    const distance = getDiffToTargetPositionDistance(diffX, diffY)
    if (targetObject.value && distance < 50) return clearTargetPosition()
    const body = chara.value.body
    const x = (!body.blocked.left && !body.blocked.right) ? diffX : diffX * 0.1
    const y = (!body.blocked.top && !body.blocked.down) ? diffY : diffY * 0.1
    body.setVelocity(x, y)
    const spd = Math.min(speed, distance * 10)
    body.velocity.normalize().scale(spd)
    if (distance < 5) clearTargetPosition()
  }
  return {
    targetPosition,
    setTargetPosition,
    clearTargetPosition,
    hasTargetPosition,
    getDiffToTargetPositionX,
    getDiffToTargetPositionY,
    getDiffToTargetPositionDistance,
    walkToTargetPosition,
    targetObject,
    setTargetObject
  }
}
