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
import useFieldManager from '../libs/useFieldManager'
import InjectionKeys from '../libs/InjectionKeys'
import useTalk from '../libs/useTalk'
import useAudio from '../libs/useAudio'
import DebugInfo from './DebugInfo.vue'
import useFreeze from '../libs/useFreeze'
import useController from '../libs/useController'
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
