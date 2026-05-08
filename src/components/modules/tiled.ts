import config from '../../data/config'
import { strColorToInt } from './util'

export type TileRaw = {
  id: number,
  type?: string
}
type TilemapProperty = {
  name: 'ambient' | 'darkness'
  type: 'color'
  value: string
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
type CharacterProperty = {
  name: 'checkable'
  type: 'bool'
  value: boolean
}
type SubstanceProperty = {
  name: 'checkable'
  type: 'bool'
  value: boolean
}
type TileLayerProperty = {
  name: 'depth'
  type: 'string'
  value: keyof typeof config.DEPTH
}

export type Tilemap = Omit<Phaser.Tilemaps.Tilemap, 'properties'> & {
  properties: TilemapProperty[]
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
  properties: CharacterProperty[]
}
export type SubstanceTiledObject = Omit<Phaser.Types.Tilemaps.TiledObject, 'properties'> & {
  type: 'Substance'
  x: number
  y: number
  rotation: number
  properties: SubstanceProperty[]
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
  properties: TileLayerProperty[]
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
export type LayerData = TileLayerData | ObjectGroupLayerData | ImageLayerData

// properties配列の各プロパティの値の型を取得（color型、depth名はnumberに変換される）
type PropertyValue<P> = P extends { type: 'color'; value: string } 
  ? number  // strColorToIntで変換されるのでnumber
  : P extends { name: 'depth'; value: infer V }
    ? V extends keyof typeof config.DEPTH ? number : never  // config.DEPTH[value]で変換されるのでnumber
  : P extends { value: infer V } 
    ? V 
    : never
// properties配列をフラットなオブジェクト型に変換
type PropertiesToObject<T extends readonly { name: string; type?: string; value: any }[]> = {
  [K in T[number]['name']]: PropertyValue<Extract<T[number], { name: K }>>
}
// mapPropertiesの戻り値の型
export type MappedTiledData<T extends { properties?: readonly any[] }> = 
  Omit<T, 'properties'> & 
  (T['properties'] extends readonly any[] ? PropertiesToObject<T['properties']> : {})
export const mapProperties = <T extends { properties?: readonly any[] }>(obj: T): MappedTiledData<T> => {
  const { properties, ...rest } = obj
  const mapped: any = { ...rest }
  properties?.forEach(property => {
    if (property.type === 'color') {
      mapped[property.name] = strColorToInt(property.value)
    } else if (property.name === 'depth') {
      mapped[property.name] = config.DEPTH[property.value as keyof typeof config.DEPTH] ?? NaN
    } else {
      mapped[property.name] = property.value
    }
  })
  return mapped
}

export const getTilesets = (tilemap: Phaser.Tilemaps.Tilemap) => {
  return tilemap.tilesets.map(tileset => tilemap.addTilesetImage(tileset.name, `tileset/${tileset.name}`, 32, 32))
    .filter(v => v !== null)
}
export const getLayers = (tilemap: Phaser.Tilemaps.Tilemap) => {
  return (tilemap.layers as TileLayerData[]).map((layer, index) => {
    if (!layer.visible) return null
    return { ...mapProperties(layer), index }
  }).filter(v => v !== null)
}
export const getTiles = (scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap) => {
  return tilemap.tilesets.map(set => {
    const tiles: TileRaw[] = scene.cache.json.get(set.name).tiles || []
    return tiles.map(v => {
      return {
        ...v,
        id: v.id + set.firstgid
      }
    })
  }).flat()
}

export const getImages = (rawData: Phaser.Tilemaps.MapData) => {
  return (rawData.layers as LayerData[])
    .filter(l => l.visible)
    .filter(l => l.type === 'imagelayer')
}

export const getObjects = (rawData: Phaser.Tilemaps.MapData): TiledObject[] => {
  const layers = rawData.layers as LayerData[]
  return layers
    .filter(l => l.visible)
    .filter(l => l.type === 'objectgroup')
    .map(v => v.objects)
    .flat()
}
