import { onPreUpdate, useScene } from 'phavuer'
import { inject, proxyRefs, reactive, ref, toRefs } from 'vue'
import useFollowing from './useFollowing'
import InjectionKeys from './InjectionKeys'

export const usePlayer = (x: number, y: number) => {
  const gameObject = ref<Phaser.GameObjects.Container>()
  const data = reactive({
    x,
    y,
    radian: 0,
    rotation: 0,
    velocityX: 0,
    velocityY: 0
  })
  const scene = useScene()
  const freeze = inject(InjectionKeys.Freeze)!
  const controller = inject(InjectionKeys.Controller)!
  const isMobile = inject(InjectionKeys.Mobile)!
  const camera = scene.cameras.main
  const following = useFollowing(data)
  onPreUpdate(() => {
    if (freeze.isFrozen) {
      data.velocityX = 0
      data.velocityY = 0
      return
    }
    const { x: velocityX, y: velocityY } = following.play() ?? { x: 0, y: 0 }
    data.velocityX = velocityX
    data.velocityY = velocityY
    const pointer = scene.input.activePointer
    if (pointer.isDown && !isMobile) {
      const worldX = pointer.x + camera.scrollX
      const worldY = pointer.y + camera.scrollY
      following.setTargetPosition(worldX, worldY)
    }
    if (controller.velocityX || controller.velocityY) {
      data.velocityX = controller.velocityX * 150
      data.velocityY = controller.velocityY * 150
    }
  })
  return proxyRefs({
    ...toRefs(data),
    gameObject
  })
}
export type Player = ReturnType<typeof usePlayer>
export default usePlayer

