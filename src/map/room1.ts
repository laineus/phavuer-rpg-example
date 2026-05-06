import { inject } from 'vue'
import InjectionKeys from '../components/modules/InjectionKeys'
import { Talker } from '../components/modules/useTalk'
import { Field } from '../components/modules/fieldService'
export default {
  bgm: 'town',
  create (field: Field) {
    field.events.set(11, () => {
      console.log('area11enter')
    })
    const talk = inject(InjectionKeys.Talk)!
    field.events.set(16, () => {
      const scripts = t('events.room1.npc1', { pluginName: 'Phavuer' })
      const tNpc: Talker = { name: 'NPC', pos: field.characters.find(v => v.id === 16)! }
      const tPlayer: Talker = { name: 'Player', pos: field.player }
      talk.setTalk([
        { talker: tNpc, message: scripts.shift() },
        { talker: tPlayer, message: scripts.shift() },
        { talker: tNpc, message: scripts.shift() }
      ])
    })
    field.events.set(17, () => {
      const scripts = t('events.room1.npc1', { pluginName: 'Phavuer' })
      const tNpc: Talker = { name: 'NPC', pos: field.substances.find(v => v.id === 17)! }
      const tPlayer: Talker = { name: 'Player', pos: field.player }
      talk.setTalk([
        { talker: tNpc, message: '花です' }
      ])
    })
  }
}
