import { InjectionKey } from 'vue'
import fieldService from './fieldService'
import useFieldManager from './useFieldManager'
import { GameObjects } from 'phaser'
import useTalk from './useTalk'

export default {
  Field: Symbol('field') as InjectionKey<ReturnType<typeof fieldService>>,
  FieldManager: Symbol('fieldManager') as InjectionKey<ReturnType<typeof useFieldManager>>,
  ColliderGroup: Symbol('colliderGroup') as InjectionKey<GameObjects.Group>,
  Talk: Symbol('talk') as InjectionKey<ReturnType<typeof useTalk>>,
}
