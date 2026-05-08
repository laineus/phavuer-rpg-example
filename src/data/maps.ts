import { Field } from '../libs/useField'
import room1 from './map/room1'
import town1 from './map/town1'

export type MapConfig = {
  bgm: string
  create: (field: Field) => void
}

const mapConfigs: Record<string, MapConfig> = {
  room1,
  town1
}

const getMapConfig = (key: string): MapConfig | undefined => mapConfigs[key]
export default getMapConfig
