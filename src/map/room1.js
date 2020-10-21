import { inject } from 'vue'
export default {
  bgm: 'town',
  create () {
    const field = inject('field')
    const talk = inject('talk')
    const player = inject('player')
    const npc = field.value.getObjectById(16)
    npc.setTapEvent(() => {
      talk.value.setTalk([
        { chara: npc, text: 'aaaaaaaaaaaaaaaaaaa' },
        { chara: player.value, text: 'bbbb' },
        { chara: npc, text: 'あいうえおか\nきくけこ' }
      ])
    })
  }
}
