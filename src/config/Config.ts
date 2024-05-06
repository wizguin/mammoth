import type { levels } from '../logger/LoggerLevels'
import loadJson from '../utils/LoadJson'
import Logger from '@Logger'

import type { Assert } from 'ts-runtime-checks'

interface Config {
    allowedVersions: string[],
    logLevel: keyof typeof levels,
    worlds: Worlds
}

interface Worlds {
    [key: string]: {
        port: number,
        maxUsers: number
    }
}

const config: Config = loadJson('config/config') as Assert<Config>

Logger.level = config.logLevel

export const allowedVersions = config.allowedVersions
export const worlds = config.worlds
