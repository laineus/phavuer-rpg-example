import { proxyRefs, reactive, readonly, toRefs } from 'vue'

const useFieldManager = () => {
  const data = reactive({
    key: null,
    initialX: NaN,
    initialY: NaN
  } as {
    key: string | null,
    initialX: number,
    initialY: number
  })
  const setField = (key: string, x: number, y: number) => {
    data.key = key
    data.initialX = x
    data.initialY = y
  }
  return proxyRefs({
    ...toRefs(readonly(data)),
    setField
  })
}
export default useFieldManager
export type FieldManager = ReturnType<typeof useFieldManager>
