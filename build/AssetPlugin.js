const fs = require('fs')
const sizeOf = require('image-size')
const path = require('path')

const defaultSettings = {
  documentRoot: 'public',
  spriteSheetSettingsFileName: 'settings.json'
}

const getSpriteSheetOption = (filePath, numOfX, numOfY) => {
  const { width, height } = sizeOf(filePath)
  const frameWidth = Math.round(width / numOfX)
  const frameHeight = Math.round(height / numOfY)
  const endFrame = numOfX * numOfY
  return { frameWidth, frameHeight, endFrame }
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
    const data = this.getAssetsData()
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
      const data = this.getAssetsData()
      assetsModule.request = JSON.stringify(data)
      fs.writeFileSync('./.assets.json', JSON.stringify(data, null, '  '))
      console.log('AssetsPlugin: Updated!')
    })
  }
  getAssetsData () {
    const data = this.patterns.reduce((result, pattern) => {
      const dir = `./public/${pattern.dir}`
      const files = fs.readdirSync(dir)
      const spriteSheetSettings = this.getSpriteSheetSttings(dir)
      const list = files.filter(file => pattern.rule.test(file)).reduce((list, file) => {
        const fileWithoutExt = file.split('.')[0]
        const key = `${pattern.prefix}${fileWithoutExt}`
        const path = `.${pattern.dir}/${file}`
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
      if (pattern.callback) pattern.callback(list)
      result[pattern.type] = result[pattern.type] ? result[pattern.type].concat(list) : [...list]
      return result
    }, {})
    data.spritesheet = data.image.filter(v => v.length === 3)
    data.image = data.image.filter(v => v.length === 2)
    return data
  }
  getSpriteSheetSttings (dir) {
    const pathToSettings = `${dir}/${this.settings.spriteSheetSettingsFileName}`
    if (!fs.existsSync(pathToSettings)) return null
    const settingsJson = fs.readFileSync(pathToSettings, 'utf8')
    try {
      return JSON.parse(settingsJson)
    } catch (error) {
      console.error(`[Error] Invalid JSON String: ${pathToSettings}`)
      return null
    }
  }
}
