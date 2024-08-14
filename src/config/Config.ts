import loadJson from '../utils/LoadJson'

import type { Assert } from 'ts-runtime-checks'

interface Config {
    allowedVersions: string[],
    preferredSpawn?: number,
    rateLimit: RateLimit,
    whitelistEnabled: boolean
}

interface RateLimit {
    enabled: boolean,
    addressConnectsPerSecond: number,
    addressEventsPerSecond: number,
    userEventsPerSecond: number
}

const config: Config = loadJson('config/config') as Assert<Config>

export const allowedVersions = config.allowedVersions
export const preferredSpawn = config.preferredSpawn
export const rateLimit = config.rateLimit
export const whitelistEnabled = config.whitelistEnabled
