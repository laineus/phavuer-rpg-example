import useTranslate, { ReplacementValues } from '../util/useTranslate'
import translationData from '../locales/index'
import setting from './setting'

const translate = useTranslate(translationData)

export default (key: string, values?: ReplacementValues) => translate(setting.state.lang, key, values)
