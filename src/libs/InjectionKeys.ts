import { InjectionKey } from 'vue'
import { Field } from './useField'
import { FieldManager } from './useFieldManager'
import useAudio from './useAudio'
import { GameObjects } from 'phaser'
import useTalk from './useTalk'
import useFreeze from './useFreeze'
import useController from './useController'

export default {
  Mobile: Symbol('mobile') as InjectionKey<boolean>, 
  Field: Symbol('field') as InjectionKey<Field>,
  FieldManager: Symbol('fieldManager') as InjectionKey<FieldManager>,
  ColliderGroup: Symbol('colliderGroup') as InjectionKey<GameObjects.Group>,
  Talk: Symbol('talk') as InjectionKey<ReturnType<typeof useTalk>>,
  Freeze: Symbol('Freeze') as InjectionKey<ReturnType<typeof useFreeze>>,
  Controller: Symbol('Controller') as InjectionKey<ReturnType<typeof useController>>,
  Audio: Symbol('audio') as InjectionKey<ReturnType<typeof useAudio>>
}
