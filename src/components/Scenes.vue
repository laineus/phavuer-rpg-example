<template>
  <TitleScene @start="onStart" />
  <GameScene />
  <DebugInfo />
</template>

<script lang="ts" setup>
import { provide } from 'vue'
import { useGame } from 'phavuer'
import TitleScene from './TitleScene.vue'
import GameScene from './GameScene.vue'
import InjectionKeys from '../libs/InjectionKeys'
import useAudio from '../libs/useAudio'
import DebugInfo from './DebugInfo.vue'
const game = useGame()
window.addEventListener('resize', () => game.scale.refresh())
provide(InjectionKeys.Mobile, !game.device.os.desktop)
provide(InjectionKeys.Audio, useAudio())
const onStart = () => {
  game.scene.getScene('TitleScene').scene.start('GameScene')
}
</script>
