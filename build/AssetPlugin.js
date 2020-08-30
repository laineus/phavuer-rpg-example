const fs = require('fs')
const sizeOf = require('image-size')

const ASSET_SETTINGS = require('./assetSettings')

const getSttings = dir => {
  const pathToSettings = `${dir}/settings.json`
  if (!fs.existsSync(pathToSettings)) return null
  const settingsJson = fs.readFileSync(pathToSettings, 'utf8')
  return JSON.parse(settingsJson)
}
const getSpriteSheetOption = (filePath, numOfX, numOfY) => {
  const { width, height } = sizeOf(filePath)
  const frameWidth = Math.round(width / numOfX)
  const frameHeight = Math.round(height / numOfY)
  const endFrame = numOfX * numOfY
  return { frameWidth, frameHeight, endFrame }
}

module.exports = class {
  apply (compiler) {
    compiler.hooks.afterEnvironment.tap('Asset', () => {
      console.log('Begin: Asset')
      const promises = ASSET_SETTINGS.map(setting => {
        return new Promise(resolve => {
          const dir = `./public/${setting.dir}`
          fs.readdir(dir, (_, files) => {
            const spriteSheetSettings = getSttings(dir)
            const list = files.filter(file => setting.rule.test(file)).reduce((list, file) => {
              const key = `${setting.prefix}${file.split('.')[0]}`
              const path = `.${setting.dir}/${file}`
              const sameKeyRow = list.find(v => v[0] === key)
              if (sameKeyRow) {
                // Apend file if existing same key
                sameKeyRow.splice(1, 1, [sameKeyRow[1], path].flat())
              } else {
                const spriteSheetSetting = spriteSheetSettings && spriteSheetSettings.find(v => v[0] === key)
                const spriteSheetOption = spriteSheetSetting && getSpriteSheetOption(`${dir}/${file}`, spriteSheetSetting[1], spriteSheetSetting[2])
                list.push(spriteSheetOption ? [key, path, spriteSheetOption] : [key, path])
              }
              return list
            }, [])
            resolve({ key: setting.key, list })
          })
        })
      })
      Promise.all(promises).then(results => {
        const object = results.reduce((obj, v) => {
          obj[v.key] = v.list
          return obj
        }, {})
        compiler.options.externals.assetData = JSON.stringify(object)
        console.log('End: Asset')
      })
    })
  }
}
