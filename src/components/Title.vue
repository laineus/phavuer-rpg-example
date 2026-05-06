<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="tap" />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { Rectangle } from 'phavuer'
import config from '../data/config'
import InjectionKeys from './modules/InjectionKeys'
const emit = defineEmits(['close'])

const fieldManager = inject(InjectionKeys.FieldManager)!
const tap = () => {
  fieldManager.setField('room1', 640, 310)
  emit('close')
}
</script>
