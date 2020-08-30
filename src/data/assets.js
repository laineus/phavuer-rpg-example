import assetData from 'assetData'
assetData.charaSprites.forEach(console.log)
export default {
  image: [
    // *
    ...assetData.sprites.filter(v => v.length === 2),
    // tileset/*
    ['tileset/room', './img/map/extruded_tilesets/room.png'],
    ['tileset/town', './img/map/extruded_tilesets/town.png'],
    ['tileset/forest', './img/map/extruded_tilesets/forest.png'],
    ['tileset/underpass', './img/map/extruded_tilesets/underpass.png'],
    ['tileset/catacomb', './img/map/extruded_tilesets/catacomb.png'],
    ['tileset/temple', './img/map/extruded_tilesets/temple.png'],
    ...assetData.tilesetImages
  ],
  audio: [
    ...assetData.se,
    ...assetData.bgm
  ],
  json: [
    ...assetData.tilesetTiles
  ],
  tilemapTiledJSON: [
    ...assetData.tilesetMaps
  ],
  spritesheet: [
    // *
    ...assetData.sprites.filter(v => v.length === 3),
    // chara_sprite/*
    ...assetData.charaSprites.filter(v => v.length === 3)
  ]
}
