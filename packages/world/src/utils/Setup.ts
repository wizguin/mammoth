import { Logger } from '@vanilla/shared'

process.on('uncaughtException', (error: Error) => {
    Logger.error(error)
    process.exit(1)
})

process.on('unhandledRejection', (error: Error) => {
    Logger.error(error)
    process.exit(1)
})
