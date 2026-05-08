<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="constants.WIDTH" :height="constants.HEIGHT" @pointerdown="tap" />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { Rectangle } from 'phavuer'
import constants from '../data/constants'
import InjectionKeys from '../libs/InjectionKeys'
const emit = defineEmits(['close'])

const fieldManager = inject(InjectionKeys.FieldManager)!
const tap = () => {
  fieldManager.setField('room1', 640, 310)
  emit('close')
}
</script>
