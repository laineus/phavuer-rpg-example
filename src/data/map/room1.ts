import { inject } from 'vue'
import InjectionKeys from '../../libs/InjectionKeys'
import { Talker } from '../../libs/useTalk'
import { Field } from '../../libs/useField'
import t from '../../data/translate'
import { MapConfig } from '../../data/maps'

export default {
  bgm: 'town',
  create (field: Field) {
    const talk = inject(InjectionKeys.Talk)!
    field.event.on('characterCheck', ({ id }) => {
      if (id === 16) {
        const scripts = t('events.room1.npc1', { pluginName: 'Phavuer' }) as string[]
        const tNpc: Talker = { name: 'NPC', pos: field.characters.find(v => v.id === 16)! }
        const tPlayer: Talker = { name: 'Player', pos: field.player }
        talk.setTalk([
          { talker: tNpc, message: scripts.shift()! },
          { talker: tPlayer, message: scripts.shift()! },
          { talker: tNpc, message: scripts.shift()! }
        ])
      }
    })
    field.event.on('substanceCheck', ({ id }) => {
      if (id === 17) {
        const tNpc: Talker = { name: 'NPC', pos: field.substances.find(v => v.id === 17)! }
        talk.setTalk([
          { talker: tNpc, message: '花です' }
        ])
      }
    })
    field.event.on('areaEnter', ({ id }) => {
      if (id === 11) {
        console.log('area11enter')
      }
    })
  }
} as MapConfig
