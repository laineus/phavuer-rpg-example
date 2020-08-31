const { extrudeTilesetToBuffer } = require('tile-extruder')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const fs = require('fs')

const TILE_SIZE = 32
const DIR = './public/img/map'
const ORIGINAL = `${DIR}/tilesets`
const EXTRUDED = `${DIR}/extruded_tilesets`

module.exports = class {
  apply (compiler) {
    compiler.hooks.afterEnvironment.tap('TileSet', () => {
      console.log('Begin: TileSet')
      fs.readdir(ORIGINAL, (_, files) => {
        const promises = files.map(async file => {
          const buffer = await extrudeTilesetToBuffer(TILE_SIZE, TILE_SIZE, `${ORIGINAL}/${file}`)
          const minifiedBuffer = await imagemin.buffer(buffer, {
            plugins: [
              imageminPngquant()
            ]
          })
          fs.writeFileSync(`${EXTRUDED}/${file}`, minifiedBuffer)
        })
        Promise.all(promises).then(() => console.log('End: TileSet'))
      })
    })
  }
}
