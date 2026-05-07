<template>
  <GameScene />
  <UIScene />
  <DebugInfo />
</template>

<script lang="ts" setup>
import GameScene from './GameScene.vue'
import UIScene from './UIScene.vue'
import { provide } from 'vue'
import { useGame } from 'phavuer'
import useFieldManager from './modules/useFieldManager'
import InjectionKeys from './modules/InjectionKeys'
import useTalk from './modules/useTalk'
import useAudio from './modules/useAudio'
import DebugInfo from './DebugInfo.vue'
import useFreeze from './modules/useFreeze'
import useController from './modules/useController'
const game = useGame()
window.addEventListener('resize', () => game.scale.refresh())
provide(InjectionKeys.Mobile, !game.device.os.desktop)
provide(InjectionKeys.Audio, useAudio())
provide(InjectionKeys.Freeze, useFreeze())
provide(InjectionKeys.Talk, useTalk())
provide(InjectionKeys.Controller, useController())
const fieldManager = useFieldManager()
provide(InjectionKeys.FieldManager, fieldManager)
</script>
