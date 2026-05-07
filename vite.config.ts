import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'
import phaserAssetsLoader from 'phaser-assets-loader/plugins/rollupPlugin'
import packageJson from './package.json'

export default defineConfig({
  plugins: [
    vue(),
    phaserAssetsLoader({
      patterns: [
        { type: 'image', prefix: '', dir: '/img/sprites', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'chara_sprite/', dir: '/img/chara_sprites', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'tileset/', dir: '/img/map/tilesets', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'tileset/', dir: '/img/map/images', rule: /^\w+\.png$/ },
        { type: 'json', prefix: '', dir: '/map/tileset_settings', rule: /^\w+\.json$/ },
        { type: 'tilemapTiledJSON', prefix: '', dir: '/map', rule: /^\w+\.json$/ },
        { type: 'audio', prefix: 'se/', dir: '/audio/se', rule: /^\w+\.wav$/ },
        { type: 'audio', prefix: 'bgm/', dir: '/audio/bgm', rule: /^\w+\.(m4a|ogg)$/ }
      ],
      output: 'src/data/assets.json'
    }),
    replace({
      preventAssignment: true,
      'APP_VERSION': JSON.stringify(packageJson.version),
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    })
  ]
})
