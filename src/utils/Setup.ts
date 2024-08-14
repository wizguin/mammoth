import Logger from '@Logger'

process.on('uncaughtException', (error: Error) => {
    Logger.error(error)
    process.exit(1)
})

process.on('unhandledRejection', (error: Error) => {
    Logger.error(error)
    process.exit(1)
})
