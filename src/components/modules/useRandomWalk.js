import { inject, ref } from 'vue'
export default (data, range) => {
  const field = inject('field')
  const radius = Math.round(range / 2)
  const delay = ref(0)
  const setNextDelay = () => {
    delay.value = Math.randomInt(100, 200)
  }
  const getRandomPosition = (tryCount = 10) => {
    if (tryCount === 0) return null
    const x = data.x + Math.randomInt(-radius, radius)
    const y = data.y + Math.randomInt(-radius, radius)
    const collides = field.value.isCollides(x.toTile, y.toTile)
    return collides ? getRandomPosition(tryCount - 1) : { x, y }
  }
  const play = callback => {
    delay.value--
    if (delay.value > 0) return
    setNextDelay()
    const pos = getRandomPosition()
    return callback(pos)
  }
  return { play }
}
