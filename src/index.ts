import 'phaser'
import { createApp } from 'vue'
import './util/extendNativeClassFunctions'
import App from './components/App.vue'
import translate from './data/translate'

// @ts-expect-error
window.t = translate

createApp(App).mount('#game')

// window.addEventListener('resize', () => game.scale.refresh())
