export type FrameAnimSetting = {
  key: string,
  frames: number[],
  duration: number
}
export default (settings: FrameAnimSetting[]) => {
  const patterns = Object.fromEntries(settings.map(({ key, frames, duration }) => {
    return [
      key,
      (tick: number) => {
        const i = Math.floor(tick / duration) % frames.length
        return frames[i]
      }
    ]
  }))
  let tick = 0
  let lastPlayedKey: string | null = null
  const play = (key: string) => {
    if (key !== lastPlayedKey) {
      tick = 0
      lastPlayedKey = key
    } else {
      tick++
    }
    return patterns[key](tick)
  }
  return {
    play
  }
}
