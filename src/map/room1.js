import { inject } from 'vue'
export default {
  bgm: 'town',
  create () {
    const field = inject('field')
    const npc = field.value.getObjectById(16)
    console.log(npc)
  }
}
