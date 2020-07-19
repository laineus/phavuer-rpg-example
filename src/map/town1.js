import townChapter0 from '../event/townChapter0'
import townChapter1 from '../event/townChapter1'
import townChapter2 from '../event/townChapter2'
import townChapter3 from '../event/townChapter3'
import townChapter4 from '../event/townChapter4'
import townChapter5 from '../event/townChapter5'
import storage from '../data/storage'
const events = [
  townChapter0,
  townChapter1,
  townChapter2,
  townChapter3,
  townChapter4,
  townChapter5
]
export default {
  name: `${t('areaSub.bellion')} - ${t('area.town')}`,
  get bgm () {
    return storage.state.chapter === 4 ? 'rain' : 'town'
  },
  create (scene) {
    scene.map.getObjectById(6).setTapEvent(async () => scene.mapChange('room1', (17).toPixel, (16).toPixelCenter, { r: 'up' }))
    const amber = scene.map.getObjectById(2).setDisplayName(t('chara.amber')).setRandomWalk(true)
    const elliott = scene.map.getObjectById(7).setDisplayName(t('chara.elliott'))
    const max = scene.map.getObjectById(8).setDisplayName(t('chara.max')).setRandomWalk(true)
    const annabelle = scene.map.getObjectById(9).setDisplayName(t('chara.annabelle'))
    const matilda = scene.map.getObjectById(10).setDisplayName(t('chara.matilda'))
    const soldier1 = scene.map.getObjectById(18).setDisplayName(t('chara.soldier')).setVisible(false)
    const soldier2 = scene.map.getObjectById(19).setDisplayName(t('chara.soldier')).setVisible(false)
    const area1 = scene.map.getObjectById(12)
    events[scene.storage.state.chapter](scene, { amber, elliott, max, annabelle, matilda, area1, soldier1, soldier2 })
    if (scene.storage.state.chapter === 4) scene.map.rain()
    this.greetings = [
      { chara: amber, message: t('townGreeting.amber'), met: false },
      { chara: elliott, message: t('townGreeting.elliott'), met: false },
      { chara: max, message: t('townGreeting.max'), met: false },
      { chara: annabelle, message: t('townGreeting.annabelle'), met: false }
    ]
    this.cp4Tweets = [
      { chara: amber, message: t('townGreeting4.amber'), met: false },
      { chara: matilda, message: t('townGreeting4.matilda'), met: false }

    ]
    scene.map.getObjectById(20).setTapEvent(async () => {
      const cp = scene.storage.state.chapter
      const messages = [
        t('townBoard.0'),
        t('townBoard.1'),
        t('townBoard.2'),
        t('townBoard.3'),
        t('townBoard.4'),
        t('townBoard.5')
      ]
      await scene.talk([
        { chara: 'ann', text: messages[cp] }
      ])
    })
  },
  update (scene) {
    const greetings = scene.storage.state.chapter === 4 ? this.cp4Tweets : this.greetings
    greetings.filter(g => !g.met && g.chara.checkable).forEach(g => {
      g.met = true
      g.chara.tweet(g.message)
    })
  }
}
