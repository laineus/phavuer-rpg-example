import { cassandra } from '../event/cassandra'
import { lamp } from '../event/aragnie'
export default {
  name: `${t('area.underpass')} - ${t('areaSub.underpass.a')}`,
  bgm: 'underpass',
  enemyLevel: 11,
  enemyGroups: [
    ['goblin'],
    ['goblin', 'goblin'],
    ['goblin', 'goblin', 'goblin']
  ],
  create (scene) {
    const jail = this.getCollideObject(scene, 'jail')
    const door = this.getCollideObject(scene, 'door')
    const cas = scene.map.getObjectById(3)
    const hector = scene.map.getObjectById(6)
    const mary = scene.map.getObjectById(7)
    const loretta = scene.map.getObjectById(8)
    cassandra(scene, scene.map.getObjectById(2), cas, door, scene.map.getObjectById(4), scene.map.getObjectById(5))
    lamp(scene, cas, hector, mary, loretta, jail, scene.map.getObjectById(9), scene.map.getImageByName('aragnie_yarn'))
    scene.ui.sleep(2000).then(() => {
      scene.tweetOnce(scene.francisca, t('tweet.un1'), 'un1')
    })
  },
  getCollideObject (scene, name) {
    const obj = scene.map.getImageByName(name)
    scene.physics.add.existing(obj)
    obj.body.setImmovable(true)
    scene.physics.add.collider([obj], scene.substances)
    return obj
  }
}
