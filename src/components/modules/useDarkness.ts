import { Scene } from 'phaser'

const numberToColoString = (v: number) => `#${v.toString(16)}`

const argbToRgba = (argb: number) => {
  const argbStr = numberToColoString(argb)
  return `#${argbStr.slice(3, 9)}${argbStr.slice(1, 3)}`
}
export default (scene: Scene, key: string, width: number, height: number) => {
  const texture = scene.textures.createCanvas(key, width, height)!
  const context = texture.getContext()
  let savedImageData: ImageData | null = null

  const save = () => {
    savedImageData = context.getImageData(0, 0, width, height)
  }
  const restore = () => {
    if (!savedImageData) return
    context.putImageData(savedImageData, 0, 0)
  }
  const refresh = () => {
    texture.refresh()
  }
  const destroy = () => {
    texture.destroy()
  }
  const fillBg = (color: number) => {
    context.globalCompositeOperation = 'source-over'
    context.fillStyle = argbToRgba(color)
    context.fillRect(0, 0, width, height)
  }
  const removeArc = (x: number, y: number, radius: number) => {
    context.beginPath()
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.globalCompositeOperation = 'destination-out'
    context.fillStyle = gradient
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }
  const removeArcs = (list: { x: number, y: number, radius: number }[]) => {
    list.forEach(v => removeArc(v.x, v.y, v.radius))
  }
  return { save, restore, refresh, destroy, fillBg, removeArc, removeArcs }
}
