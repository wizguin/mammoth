import loadJson from '../utils/LoadJson'

interface Config {
    allowedVersions: string[],
    logLevel: string,
    worlds: Worlds
}

interface Worlds {
    [key: string]: {
        port: number,
        maxUsers: number
    }
}

const config: Config = loadJson('config/config')

export const allowedVersions = config.allowedVersions
export const logLevel = config.logLevel
export const worlds = config.worlds
