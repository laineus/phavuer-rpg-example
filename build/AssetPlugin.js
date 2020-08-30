const fs = require('fs')

const ASSET_SETTINGS = require('./assetSettings')

const getSttings = dir => {
  const pathToSettings = `${dir}/settings.json`
  if (!fs.existsSync(pathToSettings)) return null
  const settingsJson = fs.readFileSync(pathToSettings, 'utf8')
  return JSON.parse(settingsJson)
}

module.exports = class {
  apply (compiler) {
    compiler.hooks.afterEnvironment.tap('Asset', () => {
      console.log('Begin: Asset')
      const promises = ASSET_SETTINGS.map(setting => {
        return new Promise(resolve => {
          const dir = `./public/${setting.dir}`
          fs.readdir(dir, (_, files) => {
            const settings = getSttings(dir)
            console.log(settings)
            const list = files.filter(file => setting.rule.test(file)).reduce((list, file) => {
              const key = `${setting.prefix}${file.split('.')[0]}`
              const path = `.${setting.dir}/${file}`
              const found = list.find(v => v[0] === key)
              found ? found.splice(1, 1, [found[1], path].flat()) : list.push([key, path])
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
