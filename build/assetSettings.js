module.exports = [
  { key: 'sprites', prefix: '', dir: '/img/sprites', rule: /^\w+\.png$/ },
  { key: 'charaSprites', prefix: 'chara_sprite/', dir: '/img/chara_sprites', rule: /^\w+\.png$/ },
  { key: 'tilesets', prefix: 'tileset/', dir: '/img/map/tilesets', rule: /^\w+\.png$/ },
  { key: 'tilesetImages', prefix: 'tileset/', dir: '/img/map/images', rule: /^\w+\.png$/ },
  { key: 'tilesetTileJsons', prefix: '', dir: '/map', rule: /^\w+\D\.json$/ },
  { key: 'tilesetMapJsons', prefix: '', dir: '/map', rule: /^\w+\d+\.json$/ },
  { key: 'se', prefix: 'se/', dir: '/audio/se', rule: /^\w+\.wav$/ },
  { key: 'bgm', prefix: 'bgm/', dir: '/audio/bgm', rule: /^\w+\.(m4a|ogg)$/ }
]
