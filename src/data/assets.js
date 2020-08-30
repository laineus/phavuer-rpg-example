import assetData from 'assetData'
import charaSpriteData from 'charaSpriteData'
export default {
  image: [
    // *
    ...assetData.sprites,
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
    ['check', './img/check.ss.png', { frameWidth: 14, frameHeight: 13, endFrame: 2 }],
    ['world_pin', './img/world_pin.ss.png', { frameWidth: 32, frameHeight: 32, endFrame: 2 }],
    ['virtual_button', './img/virtual_button.ss.png', { frameWidth: 100, frameHeight: 100, endFrame: 2 }],
    ['menu_icons', './img/menu_icons.ss.png', { frameWidth: 72, frameHeight: 72, endFrame: 4 }],
    ['weapon_abilities', './img/weapon_abilities.ss.png', { frameWidth: 18, frameHeight: 18, endFrame: 3 }],
    ['battle_effects', './img/battle_effects.ss.png', { frameWidth: 320, frameHeight: 320, endFrame: 6 }],
    ['tileset/door_gimmick', './img/tilesets/image/door_gimmick.ss.png', { frameWidth: 48, frameHeight: 66, endFrame: 3 }],
    ['tileset/door_gimmick_light', './img/tilesets/image/door_gimmick.ss.png', { frameWidth: 48, frameHeight: 33, endFrame: 7 }],
    // chara_sprite/*
    ...charaSpriteData
  ]
}
