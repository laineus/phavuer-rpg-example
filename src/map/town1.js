import { inject } from 'vue'
export default {
  bgm: 'town',
  create () {
    const field = inject('field')
    const gameScene = inject('gameScene')
    const substance = field.value.getObjectById(6)
    substance.setTapEvent(() => gameScene.value.setField('room1', 17 * 32, 17 * 32))
  }
}
