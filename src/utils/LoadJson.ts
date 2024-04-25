import { readFileSync } from 'fs'

export default function loadJson(path: string) {
    return JSON.parse(readFileSync(`${path}.json`, 'utf-8'))
}
