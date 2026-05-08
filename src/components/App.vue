<template>
  <Game :config="gameConfig">
    <Scenes />
  </Game>
</template>

<script lang="ts" setup>
import * as Phaser from 'phaser'
import { Game } from 'phavuer'
import constants from '../data/constants'
import Scenes from './Scenes.vue'
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { x: 0, y: 0 }
    }
  },
  audio: {
    disableWebAudio: true
  },
  input: {
    activePointers: 3
  }
}
</script>
