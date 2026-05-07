export type TileRaw = {
  id: number,
  type: string
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
