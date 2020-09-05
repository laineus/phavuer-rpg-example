const fs = require('fs')
const sizeOf = require('image-size')
const path = require('path')

const defaultSettings = {
  documentRoot: 'public'
}

const getSpriteSheetSttings = dir => {
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

const getAssetsData = patterns => {
  const results = patterns.map(setting => {
    const dir = `./public/${setting.dir}`
    const files = fs.readdirSync(dir)
    const spriteSheetSettings = getSpriteSheetSttings(dir)
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
    return { type: setting.type, list }
  })
  const makeAssetsData = resultsForEachDir => {
    const object = resultsForEachDir.reduce((obj, v) => {
      obj[v.type] = obj[v.type] ? obj[v.type].concat(v.list) : [...v.list]
      return obj
    }, {})
    object.spritesheet = object.image.filter(v => v.length === 3)
    object.image = object.image.filter(v => v.length === 2)
    return object    
  }
  return makeAssetsData(results)
}

module.exports = class {
  constructor (patterns, settings) {
    this.patterns = patterns
    this.settings = { ...defaultSettings, ...settings }
  }
  apply (compiler) {
    compiler.hooks.afterEnvironment.tap('Asset', this.afterEnvironment.bind(this, compiler))
    compiler.hooks.afterCompile.tap('Asset', this.afterCompile.bind(this))
  }
  afterEnvironment (compiler) {
    console.log('AssetsPlugin: Initializing...')
    const data = getAssetsData(this.patterns)
    compiler.options.externals.assets = JSON.stringify(data)
    fs.writeFileSync('./.assets.json', JSON.stringify(data, null, '  '))
    console.log('AssetsPlugin: Initialized!')
  }
  afterCompile (compilation) {
    compilation.fileDependencies.add(path.resolve('./.assets.json'))
    fs.watch('./public/img/sprites', event => {
      if (event !== 'rename') return
      const assetsModule = compilation.modules.find(v => v.userRequest === 'assets')
      if (!assetsModule) return
      console.log('AssetsPlugin: Updating...')
      const data = getAssetsData(this.patterns)
      assetsModule.request = JSON.stringify(data)
      fs.writeFileSync('./.assets.json', JSON.stringify(data, null, '  '))
      console.log('AssetsPlugin: Updated!')
    })
  }
}
