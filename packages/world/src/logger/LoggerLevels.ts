import type { LeveledLogMethod, Logger } from 'winston'

export const levels = {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4
}

export const colors = {
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'white',
    debug: 'gray'
}

export interface CustomLogger extends Logger {
    error: LeveledLogMethod,
    warn: LeveledLogMethod,
    success: LeveledLogMethod,
    info: LeveledLogMethod,
    debug: LeveledLogMethod
}
