export default (sound: Phaser.Sound.WebAudioSoundManager | Phaser.Sound.HTML5AudioSoundManager) => {
  let currentBgm: Phaser.Sound.BaseSound | null = null

  const play = (key: string, volume: number) => {
    try {
      return sound.play(key, { volume })
    } catch {
      return null
    }
  }
  const loop = (key: string, volume: number) => {
    try {
      return sound.add(key, { volume, loop: true })
    } catch {
      return null
    }
  }

  const playSe = (name: string, volume: number) => {
    play(`se/${name}`, volume)
  }
  const playBgm = (name: string | null, volume: number) => {
    if (!name) {
      currentBgm = null
      sound.stopAll()
      return
    }
    const key = `bgm/${name}`
    if (currentBgm?.key === key) return
    currentBgm?.stop()
    currentBgm = loop(key, volume)
    currentBgm?.play()
  }
  const updateVolume = (volume: number) => {
    sound.setVolume(volume)
  }
  const interruptBgm = (name: string, volume: number) => {
    const key = `bgm/${name}`
    if (currentBgm?.key === key) return () => null
    currentBgm?.pause()
    const bgm = loop(key, volume)
    bgm?.play()
    const resolve = () => {
      currentBgm?.resume()
      if (bgm?.isPlaying) bgm.stop()
    }
    return resolve
  }
  return { playSe, playBgm, interruptBgm, updateVolume }
}
