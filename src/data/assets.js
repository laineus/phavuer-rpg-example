import assetData from 'assetData'
assetData.charaSprites.forEach(console.log)
export default {
  image: [
    // *
    ...assetData.sprites.filter(v => v.length === 2),
    // tileset/*
    ...assetData.tilesets.map(v => [v[0], v[1].replace('map/tilesets', 'map/extruded_tilesets')]),
    ...assetData.tilesetImages
  ],
  audio: [
    ...assetData.se,
    ...assetData.bgm
  ],
  json: [
    ...assetData.tilesetTileJsons
  ],
  tilemapTiledJSON: [
    ...assetData.tilesetMapJsons
  ],
  spritesheet: [
    // *
    ...assetData.sprites.filter(v => v.length === 3),
    // chara_sprite/*
    ...assetData.charaSprites.filter(v => v.length === 3)
  ]
}
