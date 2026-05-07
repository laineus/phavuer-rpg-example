import * as Phaser from 'phaser'
import { onPreUpdate, useScene } from 'phavuer'
import { inject, proxyRefs, reactive, ref } from 'vue'
import useFollowing from './useFollowing'
import useRandomWalk from './useRandomWalk'
import InjectionKeys from './InjectionKeys'
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
type TileRaw = {
  id: number,
  type: string
}
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
export const strColorToInt = (str: string) => parseInt(str.slice(1), 16)
const getImages = (rawData: Phaser.Tilemaps.MapData) => {
  return (rawData.layers as LayerData[]).filter(l => l.visible && l.type === 'imagelayer') as ImageLayerData[]
}

type LightProperty = {
  name: 'color'
  type: 'color'
  value: string
} | {
  name: 'intensity'
  type: 'float'
  value: number
} | {
  name: 'radius'
  type: 'int'
  value: number
}
type GateProperty = {
  name: 'fieldX'
  type: 'float'
  value: number
} | {
  name: 'fieldY'
  type: 'int'
  value: number
}
type TileLayerProperty = {
  name: 'depth'
  type: 'string'
  value: string
}

export type LightTiledObject = Omit<Phaser.Types.Tilemaps.TiledObject, 'properties'> & {
  type: 'Light'
  x: number
  y: number
  rotation: number
  properties: LightProperty[]
}
export type CharacterTiledObject = Omit<Phaser.Types.Tilemaps.TiledObject, 'properties'> & {
  type: 'Character'
  x: number
  y: number
  rotation: number
  properties: []
}
export type SubstanceTiledObject = Omit<Phaser.Types.Tilemaps.TiledObject, 'properties'> & {
  type: 'Substance'
  x: number
  y: number
  rotation: number
  properties: []
}
export type AreaTiledObject = Omit<Phaser.Types.Tilemaps.TiledObject, 'properties'> & {
  type: 'Area'
  x: number
  y: number
  rotation: number
  properties: []
}
export type GateTiledObject = Omit<Phaser.Types.Tilemaps.TiledObject, 'properties'> & {
  type: 'Gate'
  x: number
  y: number
  rotation: number
  properties: GateProperty[]
}
export type TiledObject = LightTiledObject | CharacterTiledObject | SubstanceTiledObject | AreaTiledObject | GateTiledObject
export type TileLayerData = Omit<Phaser.Tilemaps.LayerData, 'properties'> & {
  type: 'tilelayer'
  objects: TileLayerProperty[]
}
export type ObjectGroupLayerData = Phaser.Tilemaps.LayerData & {
  type: 'objectgroup'
  objects: TiledObject[]
}
export type ImageLayerData = Phaser.Tilemaps.LayerData & {
  type: 'imagelayer'
  image: string
  opacity: number
  tintcolor: string
  offsetx: number
  offsety: number
}
export type LayerData = ObjectGroupLayerData | ImageLayerData

export const getProperty = (tileObject: TiledObject, name: string) => {
  return tileObject.properties.find(property => property.name === name)?.value
}

const getObjects = (rawData: Phaser.Tilemaps.MapData): TiledObject[] => {
  const layers = rawData.layers as LayerData[]
  return layers.filter(l => l.visible && l.type === 'objectgroup').map(v => v.objects).flat()
  return layers.filter(l => l.visible && l.type === 'objectgroup').map(v => v.objects).flat().map(data => {
    const result = mapProperties(Object.assign({}, data, { radian: (data.rotation + 90) * (Math.PI / 180) }), data.properties)
    delete result.properties
    return result
  })
}

const useChara = (v: CharacterTiledObject) => {
  const freeze = inject(InjectionKeys.Freeze)!
  const data = reactive({
    ...v,
    velocityX: 0,
    velocityY: 0
  })
  const following = useFollowing(data)
  const randomWalk = useRandomWalk(data, 100)
  onPreUpdate(() => {
    if (freeze.isFrozen) {
      data.velocityX = 0
      data.velocityY = 0
      return
    }
    const { x: velocityX, y: velocityY } = following.play() ?? { x: 0, y: 0 }
    data.velocityX = velocityX
    data.velocityY = velocityY
    randomWalk.play(pos => {
      if (!pos) return following.clearTargetPosition()
      following.setTargetPosition(pos.x, pos.y)
    })
  })
  return data
}
export type Character = ReturnType<typeof useChara>

const checkCollides = (tilemap: Phaser.Tilemaps.Tilemap, x: number, y: number) => tilemap.layers.some(v => v.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
const useCheckCollides = (tilemap: Phaser.Tilemaps.Tilemap) => (x: number, y: number) => checkCollides(tilemap, x, y)

const usePlayer = (tilemap: Phaser.Tilemaps.Tilemap, x: number, y: number) => {
  const data = reactive({
    x,
    y,
    radian: 0,
    rotation: 0,
    velocityX: 0,
    velocityY: 0
  })
  const scene = useScene()
  const freeze = inject(InjectionKeys.Freeze)!
  const controller = inject(InjectionKeys.Controller)!
  const isMobile = inject(InjectionKeys.Mobile)!
  const camera = scene.cameras.main
  const following = useFollowing(data)
  const checkCollides = useCheckCollides(tilemap)
  onPreUpdate(() => {
    if (freeze.isFrozen) {
      data.velocityX = 0
      data.velocityY = 0
      return
    }
    const { x: velocityX, y: velocityY } = following.play() ?? { x: 0, y: 0 }
    data.velocityX = velocityX
    data.velocityY = velocityY
    const pointer = scene.input.activePointer
    if (pointer.isDown && !isMobile) {
      const worldX = pointer.x + camera.scrollX
      const worldY = pointer.y + camera.scrollY
      if (checkCollides(worldX, worldY)) return
      following.setTargetPosition(worldX, worldY)
    }
    if (controller.velocityX || controller.velocityY) {
      data.velocityX = controller.velocityX * 150
      data.velocityY = controller.velocityY * 150
    }
  })
  return data
}
export type Player = ReturnType<typeof usePlayer>

export type Field = ReturnType<typeof useField>
const useField = (key: string, option: { x: number, y: number }) => {
  const events = new Map<number, () => void>()
  const scene = useScene()
  let playerGameObject: Phaser.GameObjects.Container
  const setPlayerGameObject = (v: Phaser.GameObjects.Container) => {
    playerGameObject = v
    scene.cameras.main.startFollow(v, true, 0.1, 0.1)
  }
  const getPlayerGameObject = () => {
    return playerGameObject
  }
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
  const update = getUpdateEvent(tilemap, tileSettings)
  const getObjectsByType = (type: string) => objects.filter(v => v.type === type)
  const properties = Array.isArray(tilemap.properties) ? mapProperties({}, tilemap.properties) : tilemap.properties

  const characters = ref(objects.filter(v => v.type === 'Character').map(v => useChara(v)))
  const player = usePlayer(tilemap, option.x, option.y)

  return proxyRefs({
    events,
    setPlayerGameObject,
    getPlayerGameObject,
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
    update,
    getObjectsByType,
    getTileSettingsByType: (type: string) => getTileSettingsByType(tileSettings, type),
    properties
  })
}
export default useField
