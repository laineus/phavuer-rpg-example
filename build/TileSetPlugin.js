const { extrudeTilesetToBuffer } = require('tile-extruder')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const fs = require('fs')

const plugins = [
  imageminPngquant()
]

module.exports = class {
  constructor (settings) {
    this.settings = settings
  }
  apply (compiler) {
    const inputDir = this.settings.input
    const outputDir = this.settings.output
    compiler.hooks.afterEnvironment.tap('TileSet', () => {
      console.log('TileSetPlugin: Extruding...')
      fs.readdir(inputDir, (_, files) => {
        const promises = files.map(async file => {
          this.extrude(file)
        })
        Promise.all(promises).then(() => {
          console.log('TileSetPlugin: Complete!')
          const modifiedFiles = []
          fs.watch(inputDir, (_, file) => {
            if (!modifiedFiles.includes(file)) modifiedFiles.push(file)
          })
          setInterval(() => {
            modifiedFiles.forEach(file => {
              if (fs.existsSync(`${inputDir}/${file}`)) {
                console.log(`TileSetPlugin: Updating ${file}`)
                this.extrude(file)
                console.log('TileSetPlugin: Complete!')
              } else if (fs.existsSync(`${outputDir}/${file}`)) {
                console.log(`TileSetPlugin: Deleting ${file}`)
                fs.unlinkSync(`${outputDir}/${file}`)
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
    const size = this.settings.size
    const inputDir = this.settings.input
    const outputDir = this.settings.output
    extrudeTilesetToBuffer(size, size, `${inputDir}/${file}`).then(buffer => {
      imagemin.buffer(buffer, { plugins }).then(minifiedBuffer => {
        fs.writeFileSync(`${outputDir}/${file}`, minifiedBuffer)
      })
    })
  }
}
