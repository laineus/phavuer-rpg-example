module.exports = {
  patterns: [
    { type: 'image', prefix: '', dir: '/img/sprites', rule: /^\w+\.png$/ },
    { type: 'image', prefix: 'chara_sprite/', dir: '/img/chara_sprites', rule: /^\w+\.png$/ },
    { type: 'image', prefix: 'tileset/', dir: '/img/map/extruded_tilesets', rule: /^\w+\.png$/ },
    { type: 'image', prefix: 'tileset/', dir: '/img/map/images', rule: /^\w+\.png$/ },
    { type: 'json', prefix: '', dir: '/map/tileset_settings', rule: /^\w+\.json$/ },
    { type: 'tilemapTiledJSON', prefix: '', dir: '/map', rule: /^\w+\.json$/ },
    { type: 'audio', prefix: 'se/', dir: '/audio/se', rule: /^\w+\.wav$/ },
    { type: 'audio', prefix: 'bgm/', dir: '/audio/bgm', rule: /^\w+\.(m4a|ogg)$/ }
  ],
  output: 'src/data/assets.json'
}
