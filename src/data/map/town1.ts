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
    const fieldManager = inject(InjectionKeys.FieldManager)!
    field.event.on('substanceCheck', ({ id }) => {
      if (id === 6) {
        fieldManager.setField('room1', 540, 540)
      }
    })
  }
} as MapConfig
