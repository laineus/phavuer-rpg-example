module.exports = [
  { key: 'sprites', prefix: '', dir: '/img/sprites', rule: /^\w+\.png$/ },
  { key: 'tilesetImages', prefix: 'tileset/', dir: '/img/map/images', rule: /^\w+\.png$/ },
  { key: 'tilesetTiles', prefix: '', dir: '/map', rule: /^\w+\D\.json$/ },
  { key: 'tilesetMaps', prefix: '', dir: '/map', rule: /^\w+\d+\.json$/ },
  { key: 'se', prefix: 'se/', dir: '/audio/se', rule: /^\w+\.wav$/ },
  { key: 'bgm', prefix: 'bgm/', dir: '/audio/bgm', rule: /^\w+\.(m4a|ogg)$/ }
]
