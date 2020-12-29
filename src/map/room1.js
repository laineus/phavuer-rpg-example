import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  bgm: 'town',
  create () {
    const field = inject('field')
    const talk = inject('talk')
    const player = inject('player')
    const npc = field.value.getObjectById(16)
    const tNpc = new Talker('NPC', npc.object)
    const tPlayer = new Talker('Player', player.value.object)
    npc.setTapEvent(async () => {
      const scripts = t('events.room1.npc1', { pluginName: 'Phavuer' })
      await talk.value.setTalk([
        { chara: tNpc, text: scripts.shift() },
        { chara: tPlayer, text: scripts.shift() },
        { chara: tNpc, text: scripts.shift() }
      ])
    })
  }
}
