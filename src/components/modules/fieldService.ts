import * as Phaser from 'phaser'
import { useScene } from 'phavuer'
import { proxyRefs, ref } from 'vue'
import usePlayer from './usePlayer'
import useCharacter from './useCharacter'
import { ImageLayerData, LayerData, TiledObject, TileRaw } from './tiled'
export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
const mapProperties = (base, properties) => {
  if (properties) {
    properties.forEach(property => {
      base[property.name] = property.type === 'color' ? strColorToInt(property.value) : property.value
    })
  }
  return base
}
// const parseArgb = str => {
//   return {
//     alpha: parseInt(str.slice(1, 3), 16) / 255,
//     color: parseInt(str.slice(3), 16)
//   }
// }
const getTileSettings = (scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap) => {
  return tilemap.tilesets.map(set => {
    const tiles: TileRaw[] = scene.cache.json.get(set.name).tiles || []
    return tiles.map(v => {
      return { id: v.id + set.firstgid, setting: v }
    })
  }).flat()
}
const getTileSettingsByType = (settings: ReturnType<typeof getTileSettings>, type: string) => {
  return settings.filter(tile => tile.setting.type && tile.setting.type.split(',').includes(type))
}
const getTilesets = (tilemap: Phaser.Tilemaps.Tilemap) => {
  return tilemap.tilesets.map(tileset => tilemap.addTilesetImage(tileset.name, `tileset/${tileset.name}`, 32, 32))
}
const getLayers = (tilemap: Phaser.Tilemaps.Tilemap) => {
  return tilemap.layers.map((layer, index) => {
    if (!layer.visible) return null
    return mapProperties({ index }, layer.properties)
  }).filter(Boolean)
}
export const strColorToInt = (str: string) => parseInt(str.slice(1), 16)
const getImages = (rawData: Phaser.Tilemaps.MapData) => {
  return (rawData.layers as LayerData[]).filter(l => l.visible && l.type === 'imagelayer') as ImageLayerData[]
}

export const getProperty = (tileObject: TiledObject, name: string) => {
  return tileObject.properties.find(property => property.name === name)?.value
}

const getObjects = (rawData: Phaser.Tilemaps.MapData): TiledObject[] => {
  const layers = rawData.layers as LayerData[]
  return layers.filter(l => l.visible && l.type === 'objectgroup').map(v => v.objects).flat()
}

// const checkCollides = (tilemap: Phaser.Tilemaps.Tilemap, x: number, y: number) => tilemap.layers.some(v => v.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
// const useCheckCollides = (tilemap: Phaser.Tilemaps.Tilemap) => (x: number, y: number) => checkCollides(tilemap, x, y)

export type Field = ReturnType<typeof useField>
const useField = (key: string, option: { x: number, y: number }) => {
  const events = new Map<number, () => void>()
  const scene = useScene()
  const tilemap = Phaser.Tilemaps.ParseToTilemap(scene, key)
  const rawData = scene.cache.tilemap.get(key).data as Phaser.Tilemaps.MapData
  const tileSettings = getTileSettings(scene, tilemap)
  scene.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels)
  console.log(tilemap)
  console.log(rawData)
  const layers = getLayers(tilemap)
  console.log(layers)
  const tilesets = getTilesets(tilemap)
  const images = getImages(rawData)
  const objects = getObjects(rawData)
  const substances = objects.filter(v => v.type === 'Substance')
  const areas = objects.filter(v => v.type === 'Area')
  const gates = objects.filter(v => v.type === 'Gate')
  const lights = objects.filter(v => v.type === 'Light')
  const properties = Array.isArray(tilemap.properties) ? mapProperties({}, tilemap.properties) : tilemap.properties

  const characters = ref(objects.filter(v => v.type === 'Character').map(v => useCharacter(v)))
  const player = usePlayer(option.x, option.y)

  return proxyRefs({
    events,
    characters,
    player,
    substances,
    areas,
    gates,
    images,
    lights,

    tilemap,
    width: tilemap.widthInPixels,
    height: tilemap.heightInPixels,
    layers,
    tilesets,
    objects,
    getTileSettingsByType: (type: string) => getTileSettingsByType(tileSettings, type),
    properties
  })
}
export default useField
