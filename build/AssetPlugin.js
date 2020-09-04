const fs = require('fs')
const sizeOf = require('image-size')
const path = require('path')

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

const getAssetsData = () => {
  console.log('Begin: Asset')
  const promises = ASSET_SETTINGS.map(setting => {
    return new Promise(resolve => {
      const dir = `./public/${setting.dir}`
      fs.readdir(dir, (_, files) => {
        const spriteSheetSettings = getSttings(dir)
        const list = files.filter(file => setting.rule.test(file)).reduce((list, file) => {
          const fileWithoutExt = file.split('.')[0]
          const key = `${setting.prefix}${fileWithoutExt}`
          const path = `.${setting.dir}/${file}`
          const sameKeyRow = list.find(v => v[0] === key)
          if (sameKeyRow) {
            // Apend file if existing same key
            sameKeyRow.splice(1, 1, [sameKeyRow[1], path].flat())
          } else {
            const spriteSheetSetting = spriteSheetSettings && spriteSheetSettings.find(v => v[0] === fileWithoutExt)
            const spriteSheetOption = spriteSheetSetting && getSpriteSheetOption(`${dir}/${file}`, spriteSheetSetting[1], spriteSheetSetting[2])
            list.push(spriteSheetOption ? [key, path, spriteSheetOption] : [key, path])
          }
          return list
        }, [])
        if (setting.callback) setting.callback(list)
        resolve({ type: setting.type, list })
      })
    })
  })
  return Promise.all(promises).then(results => {
    const object = results.reduce((obj, v) => {
      obj[v.type] = obj[v.type] ? obj[v.type].concat(v.list) : [...v.list]
      return obj
    }, {})
    object.spritesheet = object.image.filter(v => v.length === 3)
    object.image = object.image.filter(v => v.length === 2)
    console.log('End: Asset')
    return object
  })
}

module.exports = class {
  apply (compiler) {
    compiler.hooks.afterEnvironment.tap('Asset', () => {
      getAssetsData().then(data => {
        compiler.options.externals.assets = JSON.stringify(data)
      })
    })
    compiler.hooks.afterCompile.tap('Asset', compilation => {
      compilation.fileDependencies.add(path.resolve('./src/ts.txt'))
      fs.watch('./public/img/sprites', (event, filename) => {
        if (event !== 'rename') return
        const assetsModule = compilation.modules.find(v => v.userRequest === 'assets')
        if (!assetsModule) return
        getAssetsData().then(data => {
          assetsModule.request = JSON.stringify(data)
          console.log('updated')
        })
      })
    })
  }
}
