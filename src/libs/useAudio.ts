import useAudioManager from './useAudioManager'
import setting from '../data/setting'
import { useGame } from 'phavuer'

export default () => {
  const game = useGame()
  if (!('sounds' in game.sound)) {
    console.warn('Sound manager is not available')
    return
  }
  const sound = game.sound as Phaser.Sound.WebAudioSoundManager | Phaser.Sound.HTML5AudioSoundManager
  const audioManager = useAudioManager(sound)
  const playSe = (name: string) => audioManager.playSe(name, setting.state.bgm)
  const playBgm = (name: string | null) => audioManager.playBgm(name, setting.state.bgm)
  const interruptBgm = (name: string) => audioManager.interruptBgm(name, setting.state.bgm)
  const updateVolume = () => audioManager.updateVolume(setting.state.bgm)
  return { playSe, playBgm, interruptBgm, updateVolume }
}
