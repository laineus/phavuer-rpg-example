export default scene => {
  scene.anims.create({ key: 'treasure', frames: scene.anims.generateFrameNumbers('chara_sprite/treasure_chest', { start: 0, end: 6 }), repeat: 0, frameRate: 20 })
}
