import loadJson from '../utils/LoadJson'
import Logger from '@Logger'

export function loadData(file: string) {
    const data = loadJson(`data/${file}`)

    const name = file.replace('_', ' ')

    Logger.success(`Loaded ${Object.keys(data).length} ${name}`)

    return data
}
