<template>
  <Scene name="GameScene" :autoStart="false" @create="onSceneCreate">
    <Layer name="FieldLayer" @create="v => v.scene.cameras.getCamera('UICamera')?.ignore(v)">
      <Field v-if="fieldManager.key" :key="fieldManager.key" />
      <Talk />
    </Layer>
    <Layer name="UILayer" @create="v => v.scene.cameras.main.ignore(v)">
      <Controller />
    </Layer>
  </Scene>
</template>

<script lang="ts" setup>
import { inject, provide } from 'vue'
import { Layer, Scene } from 'phavuer'
import Field from './Field.vue'
import InjectionKeys from '../libs/InjectionKeys'
import Talk from './Talk.vue'
import Controller from './Controller.vue'
import useFreeze from '../libs/useFreeze'
import useTalk from '../libs/useTalk'
import useController from '../libs/useController'
import useFieldManager from '../libs/useFieldManager'

const fieldManager = useFieldManager()
fieldManager.setField('room1', 640, 310)

provide(InjectionKeys.Freeze, useFreeze())
provide(InjectionKeys.Talk, useTalk())
provide(InjectionKeys.Controller, useController())
provide(InjectionKeys.FieldManager, fieldManager)

const onSceneCreate = (scene: Phaser.Scene) => {
  const uiCamera = scene.cameras.add()
  uiCamera.setName('UICamera')
}
</script>
