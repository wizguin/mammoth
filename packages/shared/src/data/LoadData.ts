import Logger from '../logger/Logger'

import { readFileSync } from 'fs'
import { resolve } from 'path'

const dataDir = process.env.DATA_DIR || './data'

const dir = resolve('../../', dataDir)

export function loadData(file: string) {
    const data = loadJson(resolve(dir, file))

    const name = file.replace('_', ' ')

    Logger.success(`Loaded ${Object.keys(data).length} ${name}`)

    return data
}

export default function loadJson(path: string) {
    return JSON.parse(readFileSync(`${path}.json`, 'utf-8'))
}
