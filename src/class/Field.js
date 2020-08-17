import Area from '@/gameObjects/Area'
import Gate from '@/gameObjects/Gate'
import Character from '@/gameObjects/Character'
import Substance from '@/gameObjects/Substance'
import config from '@/data/config'
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
const parseArgb = str => {
  return {
    alpha: parseInt(str.slice(1, 3), 16) / 255,
    color: parseInt(str.slice(3), 16)
  }
}
export default class Field {
  constructor (scene, mapKey) {
    scene.add.existing(this)
    this.scene = scene
    this.name = mapKey
    this.data = scene.cache.tilemap.get(mapKey).data
    const tilemap = new Phaser.Tilemaps.ParseToTilemap(scene, mapKey)
    this.width = tilemap.widthInPixels
    this.height = tilemap.heightInPixels
    const tilesets = this.getTilesets(tilemap)
    const animationTileSettings = this.getAllTileSettings(tilemap).filter(v => 'animation' in v.setting)
    this.animationTiles = animationTileSettings.map(v => {
      const targets = tilemap.layers.filter(v => v.visible).map(l => l.data.flat()).flat().filter(tile => tile.index === v.id)
      const max = Math.sum(...v.setting.animation.map(v => v.duration))
      return { targets, animations: v.setting.animation, max }
    })
    const animationTileIds = animationTileSettings.map(v => v.id)
    this.layers = tilemap.layers.map((layer, i) => {
      if (!layer.visible) return
      const dynamicFlag = getValueByProperties(layer.properties, 'dynamic')
      const hasAnimTile = layer.data.flat().some(v => animationTileIds.includes(v.index))
      const typeName = dynamicFlag || hasAnimTile ? 'createDynamicLayer' : 'createStaticLayer'
      const depthSetting = getValueByProperties(layer.properties, 'depth')
      const layerIndex = this.data.layers.findIndex(v => v.name === layer.name)
      const depth = (DEPTH[depthSetting] || DEPTH.GROUND) + layerIndex
      return tilemap[typeName](i, tilesets, 0, 0).setDepth(depth)
    }).filter(Boolean)
    const lights = this.generateLights(tilemap)
    const darkness = getValueByProperties(tilemap.properties, 'darkness')
    if (darkness) {
      const { alpha, color } = parseArgb(darkness)
      this.renderDarkness(alpha, color, lights, this.getExposures(tilemap))
    }
    const particles = getValueByProperties(tilemap.properties, 'particles')
    if (particles) this.generateParticles(parseArgb(particles).color)
    this.images = tilemap.images.filter(data => data.visible).map(data => this.getImage(data))
    const collides = this.getTileSettingsByType(tilemap, 'collides').map(v => v.id)
    this.layers.forEach(layer => layer.setCollision(collides))
    scene.physics.add.collider(this.layers, scene.substances)
    this.objects = [
      ...this.generateGates(tilemap),
      ...this.generateAreas(tilemap),
      ...this.generateCharacters(tilemap),
      ...this.generateSubstances(tilemap)
    ]
  }
  update (time) {
    this.animationTiles.forEach(setting => {
      const current = time % setting.max
      const anim = setting.animations.find((_, i, arr) => {
        return current < Math.sum(...arr.slice(0, i + 1).map(v => v.duration))
      })
      setting.targets.forEach(v => {
        v.index = anim.tileid + 1
      })
    })
  }
  getLayerByName (name) {
    return this.layers.find(v => v.layer.name === name)
  }
  getObjectById (id) {
    return this.objects.find(v => v.id === id)
  }
  getImageByName (name) {
    return this.images.find(v => v.name === name)
  }
  isCollides (tileX, tileY) {
    return this.layers.some(layer => {
      const tile = layer.getTileAt(tileX, tileY)
      return tile && tile.collides
    })
  }
  // private
  getAllTileSettings (tilemap) {
    return tilemap.tilesets.map(set => {
      return this.scene.cache.json.get(set.name).tiles.map(v => {
        return { id: v.id + set.firstgid, setting: v }
      })
    }).flat()
  }
  getTilesets (tilemap) {
    return tilemap.tilesets.map(tileset => tilemap.addTilesetImage(tileset.name, `tileset/${tileset.name}`, 32, 32, 1, 2))
  }
  getTileSettingsByType (tilemap, type) {
    return this.getAllTileSettings(tilemap).filter(tile => tile.setting.type && tile.setting.type.split(',').includes(type)).map(tile => {
      const properties = tile.setting.properties ? tile.setting.properties.reduce((obj, v) => {
        obj[v.name] = v.value
        return obj
      }, {}) : {}
      return { id: tile.id, properties }
    })
  }
  getObjectsByType (tilemap, type) {
    return tilemap.objects.map(v => v.objects).flat().filter(v => v.type === type)
  }
  generateLights (tilemap) {
    const lights = this.getTileSettingsByType(tilemap, 'light')
    const lightTiles = this.layers.map(layer => {
      return layer.layer.data.map(row => {
        return row.filter(tile => lights.map(v => v.id).includes(tile.index))
      }).filter(arr => arr.length).flatMap(v => v)
    }).filter(arr => arr.length).flatMap(v => v)
    const getProperties = id => lights.find(l => l.id === id).properties
    return lightTiles.map(v => {
      const properties = getProperties(v.index)
      const { color } = parseArgb(properties.color)
      return this.getLight(v.x.toPixelCenter, v.y.toPixelCenter, color, properties.drop)
    })
  }
  getLight (x, y, color, drop = false) {
    const sprite = this.scene.add.sprite(x, y, 'light').setTint(color).setScale(0.5).setBlendMode(Phaser.BlendModes.OVERLAY).setDepth(DEPTH.LIGHT)
    const sprite2 = drop ? this.scene.add.sprite(x, y + 55, 'light').setAlpha(0.8).setTint(color).setScale(0.6).setBlendMode(Phaser.BlendModes.OVERLAY).setDepth(DEPTH.LIGHT) : null
    this.scene.add.tween({
      targets: [sprite, ...(sprite2 ? [sprite2] : [])], duration: Math.randomInt(300, 400),
      scale: 0.6, alpha: 0.8, yoyo: true, loop: -1
    })
    return sprite
  }
  generateParticles (color) {
    const particles = this.scene.add.particles('light')
    particles.setDepth(DEPTH.PARTICLES)
    particles.createEmitter({
      x: { min: 0, max: Math.max(this.width, (40).toPixel) },
      y: { min: 0, max: Math.max(this.height, (40).toPixel) },
      scale: { start: 0.03, end: 0.07 },
      alpha: { start: 1, end: 0.2 },
      tint: color,
      blendMode: Phaser.BlendModes.OVERLAY,
      lifespan: 2000,
      speed: { min: -20, max: 20 },
      accelerationX: 0,
      accelerationY: -25,
      frequency: 20
    })
  }
  renderDarkness (alpha, color, lights = [], exposures = []) {
    const posAndSize = [0, 0, this.width, this.height]
    const dark = this.scene.add.renderTexture(...posAndSize).fill(color, alpha, ...posAndSize).setOrigin(0.0).setDepth(DEPTH.DARKNESS)
    const brush = this.scene.add.image(0, 0, 'light').setScale(3, 3)
    lights.forEach(light => dark.erase(brush, light.x, light.y, 1))
    exposures.forEach(exp => dark.erase(brush, exp.x, exp.y, 1))
    brush.destroy()
    return dark
  }
  generateGates (tilemap) {
    return this.getObjectsByType(tilemap, 'Gate').map(data => {
      const mapX = getValueByProperties(data.properties, 'x')
      const mapY = getValueByProperties(data.properties, 'y')
      return new Gate(this.scene, data.key, mapX, mapY, data.x, data.y, data.width, data.height).setId(data.id)
    })
  }
  generateAreas (tilemap) {
    return this.getObjectsByType(tilemap, 'Area').map(data => {
      return new Area(this.scene, data.x, data.y, data.width, data.height).setId(data.id)
    })
  }
  generateCharacters (tilemap) {
    return this.getObjectsByType(tilemap, 'Character').map(data => {
      return new Character(this.scene, data.x, data.y, data.name).setR((data.rotation + 90) * (Math.PI / 180)).setId(data.id)
    })
  }
  generateSubstances (tilemap) {
    return this.getObjectsByType(tilemap, 'Substance').map(data => {
      return new Substance(this.scene, data.x, data.y, data.name).setId(data.id)
    })
  }
  getExposures (tilemap) {
    const expLayer = tilemap.objects.find(l => l.name === 'exposure')
    return expLayer ? expLayer.objects : []
  }
  getImage (data) {
    const layerIndex = this.data.layers.findIndex(v => {
      return v.image === data.image && (v.offsetx || v.x) === data.x && (v.offsety || v.y) === data.y
    })
    const originalData = this.data.layers[layerIndex]
    const image = data.image.split('/').slice(-1)[0].split('.')[0]
    const sprite = this.scene.add.sprite(data.x, data.y, `tileset/${image}`).setOrigin(0, 0).setDepth(DEPTH.GROUND + layerIndex).setAlpha(data.alpha)
    if (originalData.tintcolor) sprite.setTint(originalData.tintcolor.toColorInt)
    const blend = getValueByProperties(data.properties, 'blend')
    if (blend) sprite.setBlendMode(Phaser.BlendModes[blend])
    const depth = getValueByProperties(data.properties, 'depth')
    if (depth) {
      depth === 'SUBSTANCE' ? sprite.setDepth(data.y + (sprite.height * 0.8)) : sprite.setDepth(DEPTH[depth] + 1)
    }
    sprite.id = originalData.id
    sprite.name = data.name
    return sprite
  }
  rain () {
    const particles = this.scene.add.particles('rectangle')
    particles.setDepth(DEPTH.SUN_LIGHT).setAngle(-3)
    particles.createEmitter({
      x: { min: 0, max: Math.max(this.width, (40).toPixel) },
      y: { min: 0, max: Math.max(this.height, (40).toPixel) },
      scaleX: { start: 0.03, end: 0.07 },
      scaleY: { start: 0.4, end: 1 },
      color: config.COLORS.ghost,
      alpha: { start: 0.3, end: 0.1 },
      lifespan: 2000,
      speedY: { min: 100, max: 300 },
      accelerationX: 30,
      accelerationY: 300,
      frequency: 20
    })
    this.renderDarkness(0.3, config.COLORS.black)
  }
}
