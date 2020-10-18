export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
const propertiesToObject = properties => {
  const result = {}
  if (properties) {
    properties.forEach(property => {
      result[property.name] = property.type === 'color' ? strColorToInt(property.value) : property.value
    })
  }
  return result
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
const getLayers = (tilemap, tileSettings) => {
  const animationTileIds = tileSettings.filter(v => 'animation' in v.setting).map(v => v.id)
  return tilemap.layers.map((layer, index) => {
    if (!layer.visible) return
    const hasAnimTile = layer.data.flat().some(v => animationTileIds.includes(v.index))
    const component = hasAnimTile ? 'DynamicTilemapLayer' : 'StaticTilemapLayer'
    return { index, component, properties: propertiesToObject(layer.properties) }
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
const strColorToInt = str => parseInt(str.slice(1), 16)
const getImage = rawData => {
  const images = rawData.layers.filter(l => l.visible && l.type === 'imagelayer')
  return images.map(image => {
    return {
      id: image.id,
      key: image.image.split('/').slice(-1)[0].split('.')[0],
      name: image.name,
      x: image.offsetx,
      y: image.offsety,
      alpha: image.opacity,
      tint: image.tintcolor ? strColorToInt(image.tintcolor) : null,
      properties: propertiesToObject(image.properties)
    }
  })
}
export default class {
  constructor (scene, mapKey) {
    this.name = mapKey
    const tilemap = new Phaser.Tilemaps.ParseToTilemap(scene, mapKey)
    const rawData = scene.cache.tilemap.get(mapKey).data
    const tileSettings = getTileSettings(scene, tilemap)
    console.log(tilemap)
    console.log(rawData)

    this.tilemap = tilemap
    this.width = tilemap.widthInPixels
    this.height = tilemap.heightInPixels
    this.layers = getLayers(tilemap, tileSettings)
    this.tilesets = getTilesets(tilemap)
    this.images = getImage(rawData)
    this.update = getUpdateEvent(tilemap, tileSettings)
    this.getObjectsByType = type => {
      return tilemap.objects.map(v => v.objects).flat().filter(v => v.type === type)
    }
  }
}
