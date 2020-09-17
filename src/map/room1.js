export default {
  bgm: 'town',
  create (scene) {
    const npc = scene.map.getObjectById(16)
    // npc.setRandomWalk(true)
    // npc.setTarget(scene.player, false)
    npc.setTargetPosition(scene.player.x, scene.player.y).then(console.log)
  }
}
