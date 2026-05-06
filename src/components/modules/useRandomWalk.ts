import { inject, ref } from 'vue'

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min)) + min
const toTile = (pixel: number) => Math.floor(pixel / 32)

export default (chara: { x: number, y: number }, range: number) => {
  const field = inject('field') as any
  const radius = Math.round(range / 2)
  const delay = ref(0)
  const setNextDelay = () => {
    delay.value = randomInt(100, 200)
  }
  setNextDelay()
  const getRandomPosition = (tryCount = 10): { x: number, y: number } | null => {
    if (tryCount === 0) return null
    const x = chara.x + randomInt(-radius, radius)
    const y = chara.y + randomInt(-radius, radius)
    // const collides = field.value.isCollides(toTile(x), toTile(y))
    const collides = false
    return collides ? getRandomPosition(tryCount - 1) : { x, y }
  }
  const play = (callback: (pos: { x: number, y: number } | null) => void) => {
    delay.value--
    if (delay.value > 0) return
    setNextDelay()
    const pos = getRandomPosition()
    return callback(pos)
  }
  return { play }
}
