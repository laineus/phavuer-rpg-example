<template>
  <GameScene />
  <UIScene ref="uiScene" />
  <DebugInfo />
</template>

<script lang="ts" setup>
import GameScene from './GameScene.vue'
import UIScene from './UIScene.vue'
import { provide, ref, computed, reactive } from 'vue'
import { useGame } from 'phavuer'
import useFieldManager from './modules/useFieldManager'
import InjectionKeys from './modules/InjectionKeys'
import useTalk from './modules/useTalk'
import useAudio from './modules/useAudio'
import DebugInfo from './DebugInfo.vue'
const game = useGame()
window.addEventListener('resize', () => game.scale.refresh())
const uiScene = ref(null)
provide('uiScene', uiScene)
provide('mobile', !game.device.os.desktop)
provide(InjectionKeys.Audio, useAudio())

const talk = useTalk()
provide(InjectionKeys.Talk, talk)
const fieldManager = useFieldManager()
provide(InjectionKeys.FieldManager, fieldManager)
</script>
