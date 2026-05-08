export type TranslationData = {
  [lang: string]: {
    [key: string]: string | string[] | TranslationData
  }
}
export type ReplacementValues = Record<string, any> | string | number

const getReplaceText = (values?: ReplacementValues) => (text: string) => {
  if (typeof values === 'string' || typeof values === 'number') {
    return text.replace(/#\{\w+\}/g, values.toString())
  }
  if (typeof values === 'object') {
    return Object.keys(values).reduce((text, key) => {
      return text.replace(new RegExp(`#\\{${key}\\}`, 'g'), values[key])
    }, text)
  }
  return text
}

export default (translationData: TranslationData) => (lang: string, key: string, values?: ReplacementValues) => {
  const data = translationData[lang]
  const text = key.split('.').reduce((obj, k) => obj && (obj as any)[k], data) as string | string[] | TranslationData | undefined
  if (text === undefined) {
    console.error(`Translation missing: "${key}" of "${lang}"`)
    return 'Missing'
  }
  const replaceText = getReplaceText(values)
  if (Array.isArray(text)) {
    return text.map(replaceText)
  } else if (typeof text === 'string') {
    return replaceText(text)
  } else {
    return text
  }
}
