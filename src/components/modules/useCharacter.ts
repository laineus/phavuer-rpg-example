import { inject, reactive } from 'vue'
import InjectionKeys from './InjectionKeys'
import { CharacterTiledObject, MappedTiledData } from './tiled'
import useFollowing from './useFollowing'
import useRandomWalk from './useRandomWalk'
import { onPreUpdate } from 'phavuer'

const useCharacter = (v: MappedTiledData<CharacterTiledObject>) => {
  const freeze = inject(InjectionKeys.Freeze)!
  const data = reactive({
    ...v,
    velocityX: 0,
    velocityY: 0
  })
  const following = useFollowing(data)
  const randomWalk = useRandomWalk(data, 100)
  onPreUpdate(() => {
    if (freeze.isFrozen) {
      data.velocityX = 0
      data.velocityY = 0
      return
    }
    const { x: velocityX, y: velocityY } = following.play() ?? { x: 0, y: 0 }
    data.velocityX = velocityX
    data.velocityY = velocityY
    randomWalk.play(pos => {
      if (!pos) return following.clearTargetPosition()
      following.setTargetPosition(pos.x, pos.y)
    })
  })
  return data
}
export type Character = ReturnType<typeof useCharacter>
export default useCharacter
