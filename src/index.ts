import 'phaser'
import { createApp } from 'vue'
import './util/extendNativeClassFunctions'
import App from './components/App.vue'
import translate from './data/translate'

createApp(App).mount('#game')
