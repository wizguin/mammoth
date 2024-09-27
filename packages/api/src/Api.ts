import '@shared/env/Env'

import Edit from './routes/Edit'
import Get from './routes/Get'
import Join from './routes/Join'
import Login from './routes/Login'

import Database from './database/Database'
import Logger from './logger/Logger'
import Redis from './redis/Redis'

import fastify from 'fastify'
import fastifyFormBody from '@fastify/formbody'

(async () => {
    const app = fastify({
        ignoreDuplicateSlashes: true,
        ignoreTrailingSlash: true,
        logger: false
    })

    const port = parseInt(process.env.API_PORT || '6112')

    const routes = [Edit, Get, Join, Login]

    app.addHook('onRequest', async req => {
        const request = {
            method: req.method,
            url: req.url,

            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket.remotePort
        }

        Logger.info('Request', { request })
    })

    app.addHook('onResponse', async (req, res) => {
        const response = {
            method: req.method,
            url: req.url,

            statusCode: res.statusCode,
            elapsedTime: res.elapsedTime
        }

        Logger.info('Response', { response })
    })

    app.setErrorHandler((error, req, res) => {
        Logger.error(`${error.name} ${error.message}`)

        res.status(error.statusCode || 500).send()
    })

    app.register(fastifyFormBody)

    for (const route of routes) {
        app.register(route, { prefix: '/php' })
    }

    await Database.connect()
    await Redis.connect()

    app.listen({ host: '0.0.0.0', port: port }, err => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }

        Logger.success(`Listening on port ${port}`)
    })
})()
