import constants from '../data/constants'

/** Parse #FF0000 to 0xFF0000 */
export const strColorToInt = (str: string) => parseInt(str.slice(1), 16)

// const parseArgb = str => {
//   return {
//     alpha: parseInt(str.slice(1, 3), 16) / 255,
//     color: parseInt(str.slice(3), 16)
//   }
// }

export const byBottom = (v: number) => {
  return constants.HEIGHT - v
}
