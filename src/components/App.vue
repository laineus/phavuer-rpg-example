<template>
  <Game :config="gameConfig">
    <Scenes />
  </Game>
</template>

<script setup>
import * as Phaser from 'phaser'
import { Game } from 'phavuer'
import config from '../data/config'
import Scenes from './Scenes.vue'
const gameConfig = {
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 0 }
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
