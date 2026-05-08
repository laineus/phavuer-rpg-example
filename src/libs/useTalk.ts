// const useTalker = (name: string, pos: { x: number, y: number }) => {
// }

import { computed, proxyRefs, ref } from 'vue'

export type Talker = {
  name: string
  pos: { x: number, y: number }
}
export type TalkRow = {
  talker: Talker
  message: string
}

export default () => {
  const remain = ref<TalkRow[]>([])
  const current = computed(() => remain.value[0])
  const setTalk = (list: TalkRow[]) => {
    remain.value = list
  }
  const next = () => {
    remain.value.splice(0, 1)
  }
  return proxyRefs({
    current,
    setTalk,
    next
  })
}
