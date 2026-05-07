import { onPreUpdate } from 'phavuer'
import { computed, ref } from 'vue'
import useFrameAnim, { FrameAnimSetting } from './useFrameAnim'
import { Character } from './useCharacter'
import { Player } from './usePlayer'
const WALK_ANIM: FrameAnimSetting[] = [
  { key: 'down', frames: [1, 0, 1, 2], duration: 7 },
  { key: 'left', frames: [4, 3, 4, 5], duration: 7 },
  { key: 'right', frames: [7, 6, 7, 8], duration: 7 },
  { key: 'up', frames: [10, 9, 10, 11], duration: 7 }
]
const BASE_FRAME = { down: 1, left: 4, right: 7, up: 10 }
const velocityToDirectionKey = (x: number, y: number) => {
  if (Math.round(Math.abs(x)) > Math.round(Math.abs(y))) return x < 0 ? 'left' : 'right'
  return y < 0 ? 'up' : 'down'
}

export default (character: Character | Player) => {
  const walkAnim = useFrameAnim(WALK_ANIM)
  const directionKey = computed(() => velocityToDirectionKey(character.velocityX, character.velocityY))
  const frame = ref(BASE_FRAME[directionKey.value])
  onPreUpdate(() => {
    frame.value = Math.hypot(character.velocityX, character.velocityY) > 1
      ? walkAnim.play(directionKey.value)
      : BASE_FRAME[directionKey.value]
  })
  return frame
}
