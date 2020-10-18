export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
const getValueByProperties = (properties, key) => {
  if (!Array.isArray(properties)) return null
  const property = properties.find(v => v.name === key)
  return property ? property.value : null
}
// const parseArgb = str => {
//   return {
//     alpha: parseInt(str.slice(1, 3), 16) / 255,
//     color: parseInt(str.slice(3), 16)
//   }
// }
const getTileSettings = (scene, tilemap) => {
  return tilemap.tilesets.map(set => {
    return scene.cache.json.get(set.name).tiles.map(v => {
      return { id: v.id + set.firstgid, setting: v }
    })
  }).flat()
}
const getTilesets = tilemap => {
  return tilemap.tilesets.map(tileset => tilemap.addTilesetImage(tileset.name, `tileset/${tileset.name}`, 32, 32, 1, 2))
}
const getLayers = (tilemap, rawData, tileSettings) => {
  const animationTileIds = tileSettings.filter(v => 'animation' in v.setting).map(v => v.id)
  return tilemap.layers.map((layer, index) => {
    if (!layer.visible) return
    const dynamicFlag = getValueByProperties(layer.properties, 'dynamic')
    const hasAnimTile = layer.data.flat().some(v => animationTileIds.includes(v.index))
    const component = dynamicFlag || hasAnimTile ? 'DynamicTilemapLayer' : 'StaticTilemapLayer'
    const depthSetting = getValueByProperties(layer.properties, 'depth')
    const layerIndex = rawData.layers.findIndex(v => v.name === layer.name)
    const depth = (DEPTH[depthSetting] || DEPTH.GROUND) + layerIndex
    return { index, component, depth }
  }).filter(Boolean)
}
const getUpdateEvent = (tilemap, tilesettings) => {
  const animationTiles = tilesettings.filter(v => 'animation' in v.setting).map(v => {
    const targets = tilemap.layers.filter(v => v.visible).map(l => l.data.flat()).flat().filter(tile => tile.index === v.id)
    const max = Math.sum(...v.setting.animation.map(v => v.duration))
    return { targets, animations: v.setting.animation, max }
  })
  return (time) => {
    animationTiles.forEach(setting => {
      const current = time % setting.max
      const anim = setting.animations.find((_, i, arr) => {
        return current < Math.sum(...arr.slice(0, i + 1).map(v => v.duration))
      })
      setting.targets.forEach(v => {
        v.index = anim.tileid + 1
      })
    })
  }
}
export default class {
  constructor (scene, mapKey) {
    this.name = mapKey
    const tilemap = new Phaser.Tilemaps.ParseToTilemap(scene, mapKey)
    const rawData = scene.cache.tilemap.get(this.name).data
    const tileSettings = getTileSettings(scene, tilemap)

    this.tilemap = tilemap
    this.width = tilemap.widthInPixels
    this.height = tilemap.heightInPixels
    this.layers = getLayers(tilemap, rawData, tileSettings)
    this.tilesets = getTilesets(tilemap)
    this.update = getUpdateEvent(tilemap, tileSettings)
  }
}
