
export interface FieldEventMap {
  /** Character check event */
  characterCheck: { id: number }
  /** Object check event */
  substanceCheck: { id: number }
  /** Area enter event */
  areaEnter: { id: number }
  /** Area leave event */
  areaLeave: { id: number }
}

export default () => {
  const target = new EventTarget()

  const on = <K extends keyof FieldEventMap>(
    type: K,
    listener: (detail: FieldEventMap[K]) => void
  ): (() => void) => {
    const wrappedListener = ((e: Event) => {
      listener((e as CustomEvent<FieldEventMap[K]>).detail)
    }) as EventListener

    target.addEventListener(type, wrappedListener)

    return () => {
      target.removeEventListener(type, wrappedListener)
    }
  }

  const emit = <K extends keyof FieldEventMap>(
    type: K,
    detail: FieldEventMap[K]
  ): void => {
    target.dispatchEvent(new CustomEvent(type, { detail }))
  }

  return { on, emit }
}
