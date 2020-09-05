const { extrudeTilesetToBuffer } = require('tile-extruder')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const fs = require('fs')

const plugins = [
  imageminPngquant()
]

const TILE_SIZE = 32
const DIR = './public/img/map'
const ORIGINAL = `${DIR}/tilesets`
const EXTRUDED = `${DIR}/extruded_tilesets`

module.exports = class {
  apply (compiler) {
    compiler.hooks.afterEnvironment.tap('TileSet', () => {
      console.log('TileSetPlugin: Extruding...')
      fs.readdir(ORIGINAL, (_, files) => {
        const promises = files.map(async file => {
          this.extrude(file)
        })
        Promise.all(promises).then(() => {
          console.log('TileSetPlugin: Complete!')
          const modifiedFiles = []
          fs.watch(ORIGINAL, (_, file) => {
            if (!modifiedFiles.includes(file)) modifiedFiles.push(file)
          })
          setInterval(() => {
            modifiedFiles.forEach(file => {
              if (fs.existsSync(`${ORIGINAL}/${file}`)) {
                console.log(`TileSetPlugin: Updating ${file}`)
                this.extrude(file)
                console.log('TileSetPlugin: Complete!')
              } else if (fs.existsSync(`${EXTRUDED}/${file}`)) {
                console.log(`TileSetPlugin: Deleting ${file}`)
                fs.unlinkSync(`${EXTRUDED}/${file}`)
                console.log('TileSetPlugin: Complete!')
              }
            })
            modifiedFiles.splice(0)
          }, 1000)
        })
      })
    })
  }
  extrude (file) {
    extrudeTilesetToBuffer(TILE_SIZE, TILE_SIZE, `${ORIGINAL}/${file}`).then(buffer => {
      imagemin.buffer(buffer, { plugins }).then(minifiedBuffer => {
        fs.writeFileSync(`${EXTRUDED}/${file}`, minifiedBuffer)
      })
    })
  }
}
