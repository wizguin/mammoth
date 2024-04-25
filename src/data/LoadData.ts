import loadJson from '../utils/LoadJson'
import Logger from '@Logger'

export function loadData(file: string) {
    const data = loadJson(`data/${file}`)

    Logger.success(`Loaded ${Object.keys(data).length} ${file}`)

    return data
}
