import * as Phaser from 'phaser'
import { useScene } from 'phavuer'
import { proxyRefs, ref } from 'vue'
import usePlayer from './usePlayer'
import useCharacter from './useCharacter'
import { getImages, getLayers, getObjects, getTiles, getTilesets, mapProperties, Tilemap } from './tiled'
import useFieldEvent from './useFieldEvent'

// const checkCollides = (tilemap: Phaser.Tilemaps.Tilemap, x: number, y: number) => tilemap.layers.some(v => v.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
// const useCheckCollides = (tilemap: Phaser.Tilemaps.Tilemap) => (x: number, y: number) => checkCollides(tilemap, x, y)

export type Field = ReturnType<typeof useField>
const useField = (key: string, option: { x: number, y: number }) => {
  const event = useFieldEvent()

  const scene = useScene()
  const rawData = scene.cache.tilemap.get(key).data as Phaser.Tilemaps.MapData

  const tilemap = Phaser.Tilemaps.ParseToTilemap(scene, key) as Tilemap
  const tilesets = getTilesets(tilemap)
  const tiles = getTiles(scene, tilemap)
  const layers = getLayers(tilemap)
  const properties = mapProperties({ properties: tilemap.properties })
  const collides = tiles.filter(v => v.type?.split(',').includes('collides')).map(v => v.id)

  const player = usePlayer(option.x, option.y)
  const objects = getObjects(rawData)
  const characters = ref(objects.filter(v => v.type === 'Character').map(v => mapProperties(v)).map(v => useCharacter(v)))
  const substances = objects.filter(v => v.type === 'Substance').map(v => mapProperties(v))
  const images = getImages(rawData)
  const areas = objects.filter(v => v.type === 'Area').map(v => mapProperties(v))
  const gates = objects.filter(v => v.type === 'Gate').map(v => mapProperties(v))
  const lights = objects.filter(v => v.type === 'Light').map(v => mapProperties(v))

  scene.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels)

  return proxyRefs({
    event,

    tilemap,
    tilesets,
    layers,
    properties,
    collides,

    player,
    characters,
    substances,
    images,
    areas,
    gates,
    lights
  })
}
export default useField
