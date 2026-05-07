import { reactive } from 'vue'
type Setting = {
  bgm: number,
  se: number,
  lang: string
}
export default (defaultSetting: Setting) => {
  const state = reactive<Setting>({ ...defaultSetting })
  const save = () => {
    const json = JSON.stringify(state)
    localStorage.setItem('setting', json)
  }
  const load = () => {
    const settingString = localStorage.getItem('setting')
    if (!settingString) return
    try {
      const setting = JSON.parse(settingString) as Setting
      Object.assign(state, setting)
    } catch (error) {
      console.error('Failed to load setting:', error)
      localStorage.removeItem('setting')
    }
  }
  load()
  return { state, save }
}
