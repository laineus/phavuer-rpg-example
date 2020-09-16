export default {
  bgm: 'town',
  create (scene) {
    const npc = scene.map.getObjectById(16)
    npc.setRandomWalk(true)
  }
}
